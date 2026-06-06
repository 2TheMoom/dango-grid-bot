"use client";
import { useVault } from "@/lib/dango/useVault";

interface Props {
  walletAddress: string;
  userId: string | null;
}

export default function VaultStats({ walletAddress, userId }: Props) {
  const vault = useVault();
  return (
    <div className="card p-5">
      <h2 className="font-display font-semibold text-charcoal text-base mb-4">DLP Vault</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="label">Total Liquidity</span>
          <span className="font-mono text-sm font-semibold text-charcoal">
            {vault ? "$" + vault.totalLiquidity.toLocaleString(undefined, { maximumFractionDigits: 0 }) : "--"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="label">Share Price</span>
          <span className="font-mono text-sm font-medium text-charcoal">
            {vault ? "$" + vault.sharePrice.toFixed(4) : "--"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="label">APY</span>
          <span className="font-mono text-sm font-medium text-green">
            {vault ? vault.apy.toFixed(2) + "%" : "--"}
          </span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-[#D8D4CC]">
        <p className="font-mono text-xs text-[#6B6860] leading-relaxed">
          Deposit into the DLP vault on Dango to earn passive points between trading sessions.
        </p>
      </div>
      <button onClick={() => window.open("https://dango.exchange", "_blank")} className="mt-3 btn-secondary w-full text-sm py-2 text-center block">
        Manage on Dango
      </button>
    </div>
  );
}