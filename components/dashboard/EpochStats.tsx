"use client";

interface Props {
  walletAddress: string;
  userId: string | null;
}

export default function EpochStats({ walletAddress, userId }: Props) {
  const volume = 0;
  const target = 5000;
  const pct = Math.min(100, (volume / target) * 100);

  return (
    <div className="card p-5">
      <h2 className="font-display font-semibold text-charcoal text-base mb-4">Epoch Stats</h2>
      <div className="mb-4">
        <div className="flex justify-between mb-1.5">
          <span className="label">Volume</span>
          <span className="font-mono text-xs text-charcoal font-medium">
            ${volume.toLocaleString()}{" "}
            <span className="text-[#6B6860]">/ ${target.toLocaleString()}</span>
          </span>
        </div>
        <div className="h-2 bg-background rounded-full overflow-hidden">
          <div
            className="h-full bg-navy rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="font-mono text-xs text-[#6B6860] mt-1">
          {pct.toFixed(0)}% of weekly target
        </p>
      </div>
      <div className="grid-line pt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="label mb-1">DNG Points</p>
          <p className="font-mono font-semibold text-green text-lg">—</p>
        </div>
        <div>
          <p className="label mb-1">Epoch Ends</p>
          <p className="font-mono font-semibold text-charcoal text-lg">—</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-[#D8D4CC] flex items-center justify-between">
        <span className="font-mono text-xs text-[#6B6860]">Next lootbox at $25K</span>
        <span className="font-mono text-xs text-navy font-medium">connect SDK to track</span>
      </div>
    </div>
  );
}