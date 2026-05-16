"use client";

import { useState, useEffect } from "react";
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
  supabase,
} from "../../lib/supabase/auth";

export type BotStatus = "idle" | "running" | "stopped" | "error";

export type Strategy = {
  asset: string;
  leverage: number;
  priceRangeLow: number;
  priceRangeHigh: number;
  gridLevels: number;
  capitalAllocation: number;
  stopLossThreshold: number;
};

const DEFAULT_STRATEGY: Strategy = {
  asset: "perp/ethusd",
  leverage: 3,
  priceRangeLow: 2400,
  priceRangeHigh: 2600,
  gridLevels: 10,
  capitalAllocation: 100,
  stopLossThreshold: 70,
};

function shortenAddress(addr: string) {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function dbStrategyToLocal(db: any): Strategy {
  return {
    asset: db.asset,
    leverage: db.leverage,
    priceRangeLow: db.price_range_low,
    priceRangeHigh: db.price_range_high,
    gridLevels: db.grid_levels,
    capitalAllocation: db.capital_allocation,
    stopLossThreshold: db.stop_loss_threshold,
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
    try {
      const user = await signInWithWallet(address);
      if (!user) throw new Error("Auth failed");
      setUserId(user.id);
      setWalletAddress(address);

      // Load saved strategy + bot state from DB
      const [dbStrategy, dbBotState] = await Promise.all([
        ensureStrategy(user.id),
        ensureBotState(user.id),
      ]);

      setStrategy(dbStrategyToLocal(dbStrategy));
      setBotStatus(dbBotState.status as BotStatus);
    } catch (e) {
      console.error("Connect error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    await supabase.auth.signOut();
    setWalletAddress(null);
    setUserId(null);
    setBotStatus("idle");
    setStrategy(DEFAULT_STRATEGY);
  };

  const handleStart = async () => {
    setBotStatus("running");
    if (userId) await updateBotState(userId, { status: "running" });
  };

  const handleStop = async () => {
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
    await saveStrategy(userId, {
      asset: strategy.asset,
      leverage: strategy.leverage,
      price_range_low: strategy.priceRangeLow,
      price_range_high: strategy.priceRangeHigh,
      grid_levels: strategy.gridLevels,
      capital_allocation: strategy.capitalAllocation,
      stop_loss_threshold: strategy.stopLossThreshold,
    });
    setSaveStatus("saved");
    setEditingStrategy(false);
    setTimeout(() => setSaveStatus(""), 2000);
  };

  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="text-center mb-4">
          <h1 className="font-display font-bold text-4xl text-charcoal mb-2">
            Connect to <span className="text-navy">Dango</span>
          </h1>
          <p className="font-mono text-sm text-[#6B6860]">
            Link your wallet or import an encrypted key to start the bot
          </p>
        </div>
        {loading ? (
          <div className="font-mono text-sm text-navy animate-pulse">Setting up your account…</div>
        ) : (
          <WalletConnect onConnect={handleConnect} />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-charcoal">Grid Bot Dashboard</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-xs text-[#6B6860]">
              Dango Mainnet · {strategy.asset.replace("perp/", "").toUpperCase()}
            </span>
            <span className="font-mono text-xs text-navy bg-navy/8 border border-navy/20 px-2 py-0.5 rounded-full">
              {shortenAddress(walletAddress)}
            </span>
            <button onClick={handleDisconnect} className="font-mono text-xs text-crimson hover:underline">
              Disconnect
            </button>
          </div>
        </div>
        <BotControls
          status={botStatus}
          onStart={handleStart}
          onStop={handleStop}
          onReset={handleReset}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <GridChart strategy={strategy} botStatus={botStatus} />
        </div>
        <div className="flex flex-col gap-5">
          <EpochStats walletAddress={walletAddress} userId={userId} />
          <PnLTracker botStatus={botStatus} walletAddress={walletAddress} userId={userId} />
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <OrderBook walletAddress={walletAddress} userId={userId} />
        </div>
        <VaultStats walletAddress={walletAddress} userId={userId} />
      </div>

      {/* Strategy editor */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-semibold text-charcoal text-lg">Strategy Config</h2>
            <p className="font-mono text-xs text-[#6B6860]">
              {botStatus === "running" ? "Stop the bot to edit strategy" : "Configure your grid parameters"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {saveStatus === "saved" && (
              <span className="font-mono text-xs text-green">✓ Saved</span>
            )}
            {botStatus !== "running" && !editingStrategy && (
              <button onClick={() => setEditingStrategy(true)} className="btn-secondary text-sm py-1.5 px-4">
                Edit
              </button>
            )}
            {editingStrategy && (
              <>
                <button onClick={() => setEditingStrategy(false)} className="btn-secondary text-sm py-1.5 px-4">
                  Cancel
                </button>
                <button onClick={handleStrategySave} className="btn-primary text-sm py-1.5 px-4">
                  {saveStatus === "saving" ? "Saving…" : "Save"}
                </button>
              </>
            )}
          </div>
        </div>
        <StrategyEditor
          strategy={strategy}
          onChange={setStrategy}
          disabled={botStatus === "running" || !editingStrategy}
        />
      </div>
    </div>
  );
}