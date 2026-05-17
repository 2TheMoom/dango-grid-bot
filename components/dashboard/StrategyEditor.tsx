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

const VOLUME_TIERS = [
  { value: 3000,    label: "$3K",   desc: "Starter" },
  { value: 10000,   label: "$10K",  desc: "Basic" },
  { value: 50000,   label: "$50K",  desc: "Mid" },
  { value: 100000,  label: "$100K", desc: "Advanced" },
  { value: 250000,  label: "$250K", desc: "Pro" },
  { value: 500000,  label: "$500K", desc: "Elite" },
  { value: 1000000, label: "$1M",   desc: "Whale" },
];

const STRATEGY_TYPES = [
  {
    id: "grid",
    label: "Grid Trading",
    desc: "Places limit buy/sell orders across a price range. Captures profit from price oscillation. Best for sideways markets.",
    icon: "⚡",
  },
  {
    id: "watch",
    label: "Watch Trading",
    desc: "Monitors momentum via EMA crossovers and RSI. Enters in trend direction. Best for trending markets.",
    icon: "👁️",
  },
];

const GAS_MODES = [
  { id: "low",    label: "Low",    desc: "Slowest, cheapest — undercuts most bots" },
  { id: "normal", label: "Normal", desc: "Balanced speed and cost" },
  { id: "fast",   label: "Fast",   desc: "Priority execution, higher fee" },
];

export default function StrategyEditor({ strategy, onChange, disabled }: Props) {
  const set = (key: keyof Strategy, val: any) => onChange({ ...strategy, [key]: val });

  const inputCls = `w-full font-mono text-xs bg-background border border-[#D8D4CC] rounded px-3 py-2
    text-charcoal focus:outline-none focus:border-navy transition-colors
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  return (
    <div className="flex flex-col gap-6">

      {/* Strategy Type */}
      <div>
        <p className="label mb-3">Trading Strategy</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STRATEGY_TYPES.map((s) => (
            <button
              key={s.id}
              disabled={disabled}
              onClick={() => set("strategyType", s.id as "grid" | "watch")}
              className={`text-left p-4 rounded-lg border-2 transition-all duration-150
                ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-navy cursor-pointer"}
                ${strategy.strategyType === s.id
                  ? "border-navy bg-navy/5"
                  : "border-[#D8D4CC] bg-background"
                }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{s.icon}</span>
                <span className={`font-display font-semibold text-sm uppercase tracking-wide
                  ${strategy.strategyType === s.id ? "text-navy" : "text-charcoal"}`}>
                  {s.label}
                </span>
                {strategy.strategyType === s.id && (
                  <span className="ml-auto font-mono text-xs text-navy bg-navy/10 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className="font-mono text-xs text-[#6B6860] leading-relaxed">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Volume Target */}
      <div>
        <p className="label mb-3">Weekly Volume Target</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {VOLUME_TIERS.map((t) => (
            <button
              key={t.value}
              disabled={disabled}
              onClick={() => set("volumeTarget", t.value)}
              className={`flex flex-col items-center py-2.5 px-2 rounded-lg border-2 transition-all duration-150
                ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-navy cursor-pointer"}
                ${strategy.volumeTarget === t.value
                  ? "border-navy bg-navy/5"
                  : "border-[#D8D4CC] bg-background"
                }`}
            >
              <span className={`font-display font-bold text-sm
                ${strategy.volumeTarget === t.value ? "text-navy" : "text-charcoal"}`}>
                {t.label}
              </span>
              <span className="font-mono text-xs text-[#6B6860] mt-0.5">{t.desc}</span>
            </button>
          ))}
        </div>
        {strategy.volumeTarget >= 50000 && (
          <div className="mt-3 p-3 rounded bg-crimson/8 border border-crimson/20">
            <p className="font-mono text-xs text-crimson leading-relaxed">
              ⚠️ Targeting ${(strategy.volumeTarget / 1000).toFixed(0)}K/week requires high leverage or significant capital.
              Ensure stop-loss is configured and you understand liquidation risk.
            </p>
          </div>
        )}
      </div>

      {/* Gas / Fee Mode */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="label">Gas Mode</p>
          <span className="font-mono text-xs text-green bg-green/10 border border-green/20 px-2 py-0.5 rounded-full">
            All orders use limit (maker) to minimise fees
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {GAS_MODES.map((g) => (
            <button
              key={g.id}
              disabled={disabled}
              onClick={() => set("gasMode", g.id as "low" | "normal" | "fast")}
              className={`text-left p-3 rounded-lg border-2 transition-all duration-150
                ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-navy cursor-pointer"}
                ${strategy.gasMode === g.id
                  ? "border-navy bg-navy/5"
                  : "border-[#D8D4CC] bg-background"
                }`}
            >
              <p className={`font-display font-semibold text-sm uppercase tracking-wide mb-1
                ${strategy.gasMode === g.id ? "text-navy" : "text-charcoal"}`}>
                {g.label}
              </p>
              <p className="font-mono text-xs text-[#6B6860] leading-relaxed">{g.desc}</p>
            </button>
          ))}
        </div>
        <div className="mt-3 p-3 rounded bg-navy/5 border border-navy/20">
          <p className="font-mono text-xs text-navy leading-relaxed">
            💡 This bot always places <strong>limit orders</strong> — never market orders.
            Limit orders qualify as maker orders on Dango, which carry significantly lower fees
            than taker (market) orders used by most competing bots.
          </p>
        </div>
      </div>

      {/* Grid params */}
      {strategy.strategyType === "grid" && (
        <div>
          <p className="label mb-3">Grid Parameters</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="label mb-1.5 block">Asset</label>
              <select value={strategy.asset} onChange={(e) => set("asset", e.target.value)}
                disabled={disabled} className={inputCls}>
                {ASSETS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label mb-1.5 block">Leverage</label>
              <input type="number" min={1} max={10} value={strategy.leverage}
                onChange={(e) => set("leverage", +e.target.value)}
                disabled={disabled} className={inputCls} />
            </div>
            <div>
              <label className="label mb-1.5 block">Range Low ($)</label>
              <input type="number" value={strategy.priceRangeLow}
                onChange={(e) => set("priceRangeLow", +e.target.value)}
                disabled={disabled} className={inputCls} />
            </div>
            <div>
              <label className="label mb-1.5 block">Range High ($)</label>
              <input type="number" value={strategy.priceRangeHigh}
                onChange={(e) => set("priceRangeHigh", +e.target.value)}
                disabled={disabled} className={inputCls} />
            </div>
            <div>
              <label className="label mb-1.5 block">Grid Levels</label>
              <input type="number" min={5} max={20} value={strategy.gridLevels}
                onChange={(e) => set("gridLevels", +e.target.value)}
                disabled={disabled} className={inputCls} />
            </div>
          </div>
        </div>
      )}

      {/* Watch params */}
      {strategy.strategyType === "watch" && (
        <div>
          <p className="label mb-3">Watch Parameters</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="label mb-1.5 block">Asset</label>
              <select value={strategy.asset} onChange={(e) => set("asset", e.target.value)}
                disabled={disabled} className={inputCls}>
                {ASSETS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label mb-1.5 block">Leverage</label>
              <input type="number" min={1} max={10} value={strategy.leverage}
                onChange={(e) => set("leverage", +e.target.value)}
                disabled={disabled} className={inputCls} />
            </div>
            <div>
              <label className="label mb-1.5 block">Capital ($)</label>
              <input type="number" value={strategy.capitalAllocation}
                onChange={(e) => set("capitalAllocation", +e.target.value)}
                disabled={disabled} className={inputCls} />
            </div>
          </div>
          <div className="mt-3 p-3 rounded bg-navy/5 border border-navy/20">
            <p className="font-mono text-xs text-navy leading-relaxed">
              👁️ Watch Trading monitors price momentum using EMA crossovers and RSI signals.
              Enters in the trend direction, exits at momentum exhaustion using limit orders only.
            </p>
          </div>
        </div>
      )}

      {/* Risk Management */}
      <div>
        <p className="label mb-3">Risk Management</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="label mb-1.5 block">Capital ($)</label>
            <input type="number" value={strategy.capitalAllocation}
              onChange={(e) => set("capitalAllocation", +e.target.value)}
              disabled={disabled} className={inputCls} />
          </div>
          <div>
            <label className="label mb-1.5 block">Stop Loss (%)</label>
            <input type="number" min={50} max={95} value={strategy.stopLossThreshold}
              onChange={(e) => set("stopLossThreshold", +e.target.value)}
              disabled={disabled} className={inputCls} />
          </div>
        </div>
      </div>

    </div>
  );
}