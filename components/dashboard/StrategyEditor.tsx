"use client";

import type { Strategy } from "@/app/dashboard/page";

interface Props {
  strategy: Strategy;
  onChange: (s: Strategy) => void;
  disabled: boolean;
}

const ASSETS = [
  { id: "perp/ethusd", label: "ETH-USD" },
  { id: "perp/btcusd", label: "BTC-USD" },
  { id: "perp/solusd", label: "SOL-USD" },
];

export default function StrategyEditor({ strategy, onChange, disabled }: Props) {
  const set = (key: keyof Strategy, val: any) => onChange({ ...strategy, [key]: val });

  const fieldCls = `w-full font-mono text-xs bg-background border border-[#D8D4CC] rounded px-3 py-2
    text-charcoal focus:outline-none focus:border-navy transition-colors
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <div>
        <label className="label mb-1.5 block">Asset</label>
        <select value={strategy.asset} onChange={(e) => set("asset", e.target.value)}
          disabled={disabled} className={fieldCls}>
          {ASSETS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>
      </div>
      <div>
        <label className="label mb-1.5 block">Leverage</label>
        <input type="number" min={1} max={10} value={strategy.leverage}
          onChange={(e) => set("leverage", +e.target.value)} disabled={disabled} className={fieldCls} />
      </div>
      <div>
        <label className="label mb-1.5 block">Range Low ($)</label>
        <input type="number" value={strategy.priceRangeLow}
          onChange={(e) => set("priceRangeLow", +e.target.value)} disabled={disabled} className={fieldCls} />
      </div>
      <div>
        <label className="label mb-1.5 block">Range High ($)</label>
        <input type="number" value={strategy.priceRangeHigh}
          onChange={(e) => set("priceRangeHigh", +e.target.value)} disabled={disabled} className={fieldCls} />
      </div>
      <div>
        <label className="label mb-1.5 block">Grid Levels</label>
        <input type="number" min={5} max={20} value={strategy.gridLevels}
          onChange={(e) => set("gridLevels", +e.target.value)} disabled={disabled} className={fieldCls} />
      </div>
      <div>
        <label className="label mb-1.5 block">Stop Loss (%)</label>
        <input type="number" min={50} max={95} value={strategy.stopLossThreshold}
          onChange={(e) => set("stopLossThreshold", +e.target.value)} disabled={disabled} className={fieldCls} />
      </div>
    </div>
  );
}