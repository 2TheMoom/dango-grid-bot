"use client";

interface Props {
  botStatus: string;
  walletAddress: string;
  userId: string | null;
}

export default function PnLTracker({ botStatus, walletAddress, userId }: Props) {
  const realized = 0;
  const fees = 0;
  const net = realized + fees;

  return (
    <div className="card p-5">
      <h2 className="font-display font-semibold text-charcoal text-base mb-4">PnL Tracker</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="label">Realized PnL</span>
          <span className="font-mono text-sm font-medium text-green">
            {realized > 0 ? `+$${realized.toFixed(2)}` : "—"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="label">Fees Paid</span>
          <span className="font-mono text-sm font-medium text-crimson">
            {fees < 0 ? `$${fees.toFixed(2)}` : "—"}
          </span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-[#D8D4CC]">
          <span className="font-display font-semibold text-charcoal text-sm uppercase tracking-wide">
            Net
          </span>
          <span className={`font-mono text-base font-semibold ${net >= 0 ? "text-green" : "text-crimson"}`}>
            {net === 0 ? "—" : `${net >= 0 ? "+" : ""}$${net.toFixed(2)}`}
          </span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-[#D8D4CC] space-y-2">
        <div className="flex justify-between">
          <span className="label">Grid Cycles</span>
          <span className="font-mono text-xs text-charcoal">0 completed</span>
        </div>
        <div className="flex justify-between">
          <span className="label">Bot Status</span>
          <span className={`font-mono text-xs font-medium ${
            botStatus === "running" ? "text-green" :
            botStatus === "stopped" ? "text-crimson" : "text-[#6B6860]"
          }`}>
            {botStatus.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}