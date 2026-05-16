"use client";

export default function VaultStats({ walletAddress }: { walletAddress: string }) {
  return (
    <div className="card p-5">
      <h2 className="font-display font-semibold text-charcoal text-base mb-4">DLP Vault</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="label">My Deposit</span>
          <span className="font-mono text-sm font-semibold text-charcoal">$200.00</span>
        </div>
        <div className="flex justify-between">
          <span className="label">Vault Points</span>
          <span className="font-mono text-sm font-medium text-green">+12 pts/epoch</span>
        </div>
        <div className="flex justify-between">
          <span className="label">Vault Share</span>
          <span className="font-mono text-xs text-[#6B6860]">~0.04% of TVL</span>
        </div>
        <div className="flex justify-between">
          <span className="label">Epoch Earnings</span>
          <span className="font-mono text-xs text-green">+$0.32</span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-[#D8D4CC]">
        <p className="font-mono text-xs text-[#6B6860] leading-relaxed">
          💡 Increase vault deposit to earn more passive points between trading sessions.
        </p>
      </div>
      <button className="mt-3 btn-secondary w-full text-sm py-2">
        Manage Vault Deposit
      </button>
    </div>
  );
}