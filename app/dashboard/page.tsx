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

export default function DashboardPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [botStatus, setBotStatus] = useState<BotStatus>("idle");
  const [strategy, setStrategy] = useState<Strategy>(DEFAULT_STRATEGY);
  const [editingStrategy, setEditingStrategy] = useState(false);

  // Listen for wallet account changes
  useEffect(() => {
    const { ethereum } = window as any;
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setWalletAddress(null);
        setBotStatus("idle");
      } else {
        setWalletAddress(accounts[0]);
      }
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    return () => ethereum.removeListener("accountsChanged", handleAccountsChanged);
  }, []);

  const handleDisconnect = () => {
    setWalletAddress(null);
    setBotStatus("idle");
    setStrategy(DEFAULT_STRATEGY);
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
        <WalletConnect onConnect={(addr) => setWalletAddress(addr)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* ── Top bar ── */}
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
            <button
              onClick={handleDisconnect}
              className="font-mono text-xs text-crimson hover:underline"
            >
              Disconnect
            </button>
          </div>
        </div>
        <BotControls
          status={botStatus}
          onStart={() => setBotStatus("running")}
          onStop={() => setBotStatus("stopped")}
          onReset={() => setBotStatus("idle")}
        />
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <GridChart strategy={strategy} botStatus={botStatus} />
        </div>
        <div className="flex flex-col gap-5">
          <EpochStats walletAddress={walletAddress} />
          <PnLTracker botStatus={botStatus} walletAddress={walletAddress} />
        </div>
      </div>

      {/* ── Second row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <OrderBook walletAddress={walletAddress} />
        </div>
        <VaultStats walletAddress={walletAddress} />
      </div>

      {/* ── Strategy editor ── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-semibold text-charcoal text-lg">Strategy Config</h2>
            <p className="font-mono text-xs text-[#6B6860]">
              {botStatus === "running" ? "Stop the bot to edit strategy" : "Configure your grid parameters"}
            </p>
          </div>
          {botStatus !== "running" && (
            <button onClick={() => setEditingStrategy(!editingStrategy)} className="btn-secondary text-sm py-1.5 px-4">
              {editingStrategy ? "Cancel" : "Edit"}
            </button>
          )}
        </div>
        <StrategyEditor strategy={strategy} onChange={setStrategy} disabled={botStatus === "running" || !editingStrategy} />
      </div>
    </div>
  );
}