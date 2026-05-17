"use client";

interface Props {
  walletAddress: string;
  userId: string | null;
}

export default function VaultStats({ walletAddress, userId }: Props) {
  return (
    <div className="card p-5">
      <h2 className="font-display font-semibold text-charcoal text-base mb-4">DLP Vault</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="label">My Deposit</span>
          <span className="font-mono text-sm font-semibold text-charcoal">--</span>
        </div>
        <div className="flex justify-between">
          <span className="label">Vault Points</span>
          <span className="font-mono text-sm font-medium text-green">--</span>
        </div>
        <div className="flex justify-between">
          <span className="label">Vault Share</span>
          <span className="font-mono text-xs text-[#6B6860]">--</span>
        </div>
        <div className="flex justify-between">
          <span className="label">Epoch Earnings</span>
          <span className="font-mono text-xs text-green">--</span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-[#D8D4CC]">
        <p className="font-mono text-xs text-[#6B6860] leading-relaxed">
          Deposit into the DLP vault on Dango to earn passive points between trading sessions.
        </p>
      </div>
      <button
        onClick={() => window.open("https://dango.exchange", "_blank")}
        className="mt-3 btn-secondary w-full text-sm py-2 text-center block"
      >
        Manage on Dango
      </button>
    </div>
  );
}