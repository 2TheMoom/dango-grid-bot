"use client";

import { useState, useEffect, useRef } from "react";
import GridChart from "@/components/dashboard/GridChart";
import PnLTracker from "@/components/dashboard/PnLTracker";
import EpochStats from "@/components/dashboard/EpochStats";
import OrderBook from "@/components/dashboard/OrderBook";
import BotControls from "@/components/dashboard/BotControls";
import StrategyEditor from "@/components/dashboard/StrategyEditor";
import VaultStats from "@/components/dashboard/VaultStats";
import WalletConnect from "@/components/auth/WalletConnect";
import {
  signInWithWallet,
  ensureStrategy,
  ensureBotState,
  saveStrategy,
  updateBotState,
  clearSession,
  supabase,
} from "@/lib/supabase/auth";
import { useDangoSession, clearDangoSession } from "@/lib/dango/signerStore";
import { placeGridOrders, startGridMaintenance, cancelAllOrders, getEquity, type GridHaltReason } from "@/lib/dango/gridBot";

export type BotStatus = "idle" | "running" | "stopped" | "error";

export type Strategy = {
  asset: string;
  leverage: number;
  priceRangeLow: number;
  priceRangeHigh: number;
  gridLevels: number;
  capitalAllocation: number;
  stopLossThreshold: number;
  volumeTarget: number;
  strategyType: "grid" | "watch";
  gasMode: "low" | "normal" | "fast";
};

const DEFAULT_STRATEGY: Strategy = {
  asset: "perp/ethusd",
  leverage: 3,
  priceRangeLow: 2400,
  priceRangeHigh: 2600,
  gridLevels: 10,
  capitalAllocation: 100,
  stopLossThreshold: 70,
  volumeTarget: 3000,
  strategyType: "grid",
  gasMode: "low",
};

function shortenAddress(addr: string) {
  if (!addr || addr.length < 10) return addr;
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function dbStrategyToLocal(db: any): Strategy {
  return {
    asset: db.asset ?? DEFAULT_STRATEGY.asset,
    leverage: db.leverage ?? DEFAULT_STRATEGY.leverage,
    priceRangeLow: db.price_range_low ?? DEFAULT_STRATEGY.priceRangeLow,
    priceRangeHigh: db.price_range_high ?? DEFAULT_STRATEGY.priceRangeHigh,
    gridLevels: db.grid_levels ?? DEFAULT_STRATEGY.gridLevels,
    capitalAllocation: db.capital_allocation ?? DEFAULT_STRATEGY.capitalAllocation,
    stopLossThreshold: db.stop_loss_threshold ?? DEFAULT_STRATEGY.stopLossThreshold,
    volumeTarget: db.volume_target ?? DEFAULT_STRATEGY.volumeTarget,
    strategyType: db.strategy_type ?? DEFAULT_STRATEGY.strategyType,
    gasMode: db.gas_mode ?? DEFAULT_STRATEGY.gasMode,
  };
}

export default function DashboardPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [botStatus, setBotStatus] = useState<BotStatus>("idle");
  const [strategy, setStrategy] = useState<Strategy>(DEFAULT_STRATEGY);
  const [editingStrategy, setEditingStrategy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"" | "saving" | "saved">("");
  const [connectError, setConnectError] = useState<string | null>(null);
  const [initialising, setInitialising] = useState(true);
  const [botError, setBotError] = useState<string | null>(null);
  const dangoSession = useDangoSession();
  const stopMaintenanceRef = useRef<(() => void) | null>(null);

  // On mount — clear any stale Supabase session so dashboard always starts fresh
  useEffect(() => {
    const init = async () => {
      // Check if MetaMask is actually connected
      const { ethereum } = window as any;
      let activeAddress: string | null = null;
      if (ethereum) {
        try {
          const accounts: string[] = await ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) activeAddress = accounts[0];
        } catch {}
      }

      // If no wallet is actually connected, clear Supabase session
      if (!activeAddress) {
        await clearSession();
        setInitialising(false);
        return;
      }

      // Wallet is connected — check if we have a valid Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session && activeAddress) {
        // Restore session silently
        setWalletAddress(activeAddress);
        setUserId(session.user.id);
        try {
          const [dbStrategy, dbBotState] = await Promise.all([
            ensureStrategy(session.user.id),
            ensureBotState(session.user.id),
          ]);
          setStrategy(dbStrategyToLocal(dbStrategy));
          setBotStatus(dbBotState.status as BotStatus);
        } catch {}
      } else {
        await clearSession();
      }
      setInitialising(false);
    };
    init();
  }, []);

  // Stop the maintenance loop if the component unmounts while the bot is running
  useEffect(() => {
    return () => stopMaintenanceRef.current?.();
  }, []);

  // Listen for MetaMask account changes
  useEffect(() => {
    const { ethereum } = window as any;
    if (!ethereum) return;
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) handleDisconnect();
      else setWalletAddress(accounts[0]);
    };
    ethereum.on("accountsChanged", handleAccountsChanged);
    return () => ethereum.removeListener("accountsChanged", handleAccountsChanged);
  }, []);

  const handleConnect = async (address: string) => {
    setLoading(true);
    setConnectError(null);
    try {
      const user = await signInWithWallet(address);
      if (!user) throw new Error("Auth failed — no user returned.");
      setUserId(user.id);
      setWalletAddress(address);
      const [dbStrategy, dbBotState] = await Promise.all([
        ensureStrategy(user.id),
        ensureBotState(user.id),
      ]);
      setStrategy(dbStrategyToLocal(dbStrategy));
      setBotStatus(dbBotState.status as BotStatus);
    } catch (e: any) {
      const msg = e?.message || e?.error_description || e?.details || "Unknown error — check console";
      console.error("Connect error:", e);
      setConnectError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    stopMaintenanceRef.current?.();
    stopMaintenanceRef.current = null;
    clearDangoSession();
    await clearSession();
    setWalletAddress(null);
    setUserId(null);
    setBotStatus("idle");
    setStrategy(DEFAULT_STRATEGY);
    setConnectError(null);
    setBotError(null);
  };

  const handleHalt = async (reason: GridHaltReason) => {
    stopMaintenanceRef.current = null;
    const message =
      reason.type === "range_exit"
        ? `Price hit $${reason.price.toFixed(2)}, outside your configured range [$${strategy.priceRangeLow}, $${strategy.priceRangeHigh}] — bot stopped, all orders cancelled.`
        : `Stop-loss triggered — equity down ${reason.drawdownPct.toFixed(1)}% (threshold ${strategy.stopLossThreshold}%). Bot stopped, all orders cancelled.`;
    setBotError(message);
    setBotStatus("error");
    if (userId) await updateBotState(userId, { status: "error" });
  };

  const handleStart = async () => {
    if (!dangoSession) {
      setBotError("No signing key loaded — reconnect via \"Import Key\" to let the bot sign orders.");
      return;
    }
    setBotError(null);
    try {
      const baselineEquity = await getEquity(dangoSession);
      if (baselineEquity == null) {
        throw new Error("Could not read account equity — refusing to start without it, since stop-loss can't be enforced blind.");
      }
      await placeGridOrders(dangoSession, strategy);
      stopMaintenanceRef.current = startGridMaintenance(
        dangoSession,
        strategy,
        baselineEquity,
        (err) => setBotError(err.message),
        handleHalt
      );
      setBotStatus("running");
      if (userId) await updateBotState(userId, { status: "running" });
    } catch (e: any) {
      setBotError(e?.message || "Failed to start bot.");
      setBotStatus("error");
    }
  };

  const handleStop = async () => {
    stopMaintenanceRef.current?.();
    stopMaintenanceRef.current = null;
    try {
      if (dangoSession) await cancelAllOrders(dangoSession);
    } catch (e: any) {
      setBotError(e?.message || "Failed to cancel open orders.");
    }
    setBotStatus("stopped");
    if (userId) await updateBotState(userId, { status: "stopped" });
  };

  const handleReset = async () => {
    setBotStatus("idle");
    if (userId) await updateBotState(userId, { status: "idle" });
  };

  const handleStrategySave = async () => {
    if (!userId) return;
    setSaveStatus("saving");
    try {
      await saveStrategy(userId, {
        asset: strategy.asset,
        leverage: strategy.leverage,
        price_range_low: strategy.priceRangeLow,
        price_range_high: strategy.priceRangeHigh,
        grid_levels: strategy.gridLevels,
        capital_allocation: strategy.capitalAllocation,
        stop_loss_threshold: strategy.stopLossThreshold,
        volume_target: strategy.volumeTarget,
        strategy_type: strategy.strategyType,
        gas_mode: strategy.gasMode,
      });
      setSaveStatus("saved");
      setEditingStrategy(false);
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (e: any) {
      console.error("Save error:", e?.message || e);
      setSaveStatus("");
    }
  };

  if (initialising) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="font-mono text-sm text-[#6B6860] animate-pulse">Checking session...</div>
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="text-center mb-4">
          <h1 className="font-display font-bold text-4xl text-charcoal mb-2">
            Connect to <span className="text-navy">Dango</span>
          </h1>
          <p className="font-mono text-sm text-[#6B6860]">
            Link your wallet and sign to verify ownership
          </p>
        </div>
        {loading ? (
          <div className="font-mono text-sm text-navy animate-pulse">Setting up your account...</div>
        ) : (
          <WalletConnect onConnect={handleConnect} />
        )}
        {connectError && (
          <div className="card w-full max-w-md p-4 border-crimson/30 bg-crimson/5">
            <p className="font-mono text-xs text-crimson font-medium mb-1">Connection failed</p>
            <p className="font-mono text-xs text-crimson/80 leading-relaxed">{connectError}</p>
            <div className="mt-3 pt-3 border-t border-crimson/20 space-y-1">
              <p className="font-mono text-xs text-[#6B6860]">Things to check:</p>
              <p className="font-mono text-xs text-[#6B6860]">· Supabase anon auth enabled?</p>
              <p className="font-mono text-xs text-[#6B6860]">· .env.local keys correct?</p>
              <p className="font-mono text-xs text-[#6B6860]">· SQL tables created?</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-charcoal">Grid Bot Dashboard</h1>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="font-mono text-xs text-[#6B6860]">
              Dango Mainnet · {strategy.asset.replace("perp/", "").toUpperCase()} · {strategy.strategyType === "grid" ? "Grid" : "Watch"}
            </span>
            <span className="font-mono text-xs text-navy bg-navy/8 border border-navy/20 px-2 py-0.5 rounded-full">
              {shortenAddress(walletAddress)}
            </span>
            <span className="font-mono text-xs text-green bg-green/8 border border-green/20 px-2 py-0.5 rounded-full">
              Gas: {strategy.gasMode}
            </span>
            <button onClick={handleDisconnect} className="font-mono text-xs text-crimson hover:underline">
              Disconnect
            </button>
          </div>
        </div>
        <BotControls status={botStatus} onStart={handleStart} onStop={handleStop} onReset={handleReset} />
      </div>

      {!dangoSession && (
        <div className="card p-3 border-crimson/30 bg-crimson/5">
          <p className="font-mono text-xs text-crimson leading-relaxed">
            No signing key loaded for this session — the bot can read the market but can't place orders.
            Disconnect and reconnect via the "Import Key" tab to trade.
          </p>
        </div>
      )}
      {botError && (
        <div className="card p-3 border-crimson/30 bg-crimson/5">
          <p className="font-mono text-xs text-crimson leading-relaxed">{botError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <GridChart strategy={strategy} botStatus={botStatus} />
        </div>
        <div className="flex flex-col gap-5">
          <EpochStats walletAddress={walletAddress} userId={userId} volumeTarget={strategy.volumeTarget} />
          <PnLTracker botStatus={botStatus} walletAddress={walletAddress} userId={userId} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <OrderBook walletAddress={walletAddress} userId={userId} />
        </div>
        <VaultStats walletAddress={walletAddress} userId={userId} />
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-semibold text-charcoal text-lg">Strategy Config</h2>
            <p className="font-mono text-xs text-[#6B6860]">
              {botStatus === "running" ? "Stop the bot to edit strategy" : "Configure your grid parameters"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {saveStatus === "saved" && <span className="font-mono text-xs text-green">Saved</span>}
            {botStatus !== "running" && !editingStrategy && (
              <button onClick={() => setEditingStrategy(true)} className="btn-secondary text-sm py-1.5 px-4">Edit</button>
            )}
            {editingStrategy && (
              <>
                <button onClick={() => setEditingStrategy(false)} className="btn-secondary text-sm py-1.5 px-4">Cancel</button>
                <button onClick={handleStrategySave} className="btn-primary text-sm py-1.5 px-4">
                  {saveStatus === "saving" ? "Saving..." : "Save"}
                </button>
              </>
            )}
          </div>
        </div>
        <StrategyEditor strategy={strategy} onChange={setStrategy} disabled={botStatus === "running" || !editingStrategy} />
      </div>
    </div>
  );
}
