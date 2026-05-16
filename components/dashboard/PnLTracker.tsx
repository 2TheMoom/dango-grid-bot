"use client";

export default function PnLTracker({ botStatus, walletAddress }: { botStatus: string; walletAddress: string }) {
  const realized = 3.42;
  const fees = -1.10;
  const net = realized + fees;

  return (
    <div className="card p-5">
      <h2 className="font-display font-semibold text-charcoal text-base mb-4">PnL Tracker</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="label">Realized PnL</span>
          <span className="font-mono text-sm font-medium text-green">+${realized.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="label">Fees Paid</span>
          <span className="font-mono text-sm font-medium text-crimson">${fees.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-[#D8D4CC]">
          <span className="font-display font-semibold text-charcoal text-sm uppercase tracking-wide">Net</span>
          <span className={`font-mono text-base font-semibold ${net >= 0 ? "text-green" : "text-crimson"}`}>
            {net >= 0 ? "+" : ""}${net.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-[#D8D4CC] space-y-2">
        <div className="flex justify-between">
          <span className="label">Grid Cycles</span>
          <span className="font-mono text-xs text-charcoal">14 completed</span>
        </div>
        <div className="flex justify-between">
          <span className="label">Capital Remaining</span>
          <span className="font-mono text-xs text-charcoal font-medium">$98.90 / $100.00</span>
        </div>
      </div>
    </div>
  );
}