"use client";
import { useEffect, useState, useRef } from "react";
import {
  ComposedChart, Line, ReferenceLine, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import type { Strategy, BotStatus } from "@/app/dashboard/page";
import { usePriceFeed } from "@/lib/dango/usePriceFeed";

const PAIR_MAP: Record<string, string> = {
  "perp/ethusd": "perp/ethusd",
  "perp/btcusd": "perp/btcusd",
  "perp/solusd": "perp/solusd",
};

function getGridLevels(low: number, high: number, n: number) {
  const step = (high - low) / (n - 1);
  return Array.from({ length: n }, (_, i) => +(low + step * i).toFixed(2));
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs font-mono">
      <p className="text-[#6B6860]">{payload[0]?.payload?.time}</p>
      <p className="text-charcoal font-semibold">
        {payload[0]?.value ? "$" + (+payload[0].value).toLocaleString() : "--"}
      </p>
    </div>
  );
};

export default function GridChart({ strategy, botStatus }: { strategy: Strategy; botStatus: BotStatus }) {
  const { priceRangeLow, priceRangeHigh, gridLevels, asset } = strategy;
  const pairId = PAIR_MAP[asset] ?? asset;
  const { prices, connected } = usePriceFeed([pairId]);

  const livePrice = prices[pairId]?.price ?? null;
  const change24h = prices[pairId]?.change24h ?? 0;

  const [priceHistory, setPriceHistory] = useState<{ time: string; price: number }[]>([]);
  const tickRef = useRef(0);

  useEffect(() => {
    if (!livePrice) return;
    tickRef.current += 1;
    const now = new Date();
    const label = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
    setPriceHistory((prev) => {
      const next = [...prev, { time: label, price: livePrice }];
      return next.slice(-48);
    });
  }, [livePrice]);

  const displayPrice = livePrice ?? (priceRangeLow + priceRangeHigh) / 2;
  const levels = getGridLevels(priceRangeLow, priceRangeHigh, gridLevels);
  const yMin = priceRangeLow * 0.97;
  const yMax = priceRangeHigh * 1.03;

  const chartData = priceHistory.length > 1 ? priceHistory : [
    { time: "00:00", price: displayPrice },
    { time: "now", price: displayPrice },
  ];

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-display font-semibold text-charcoal text-lg">
            {asset.replace("perp/", "").toUpperCase()} Grid
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="font-mono text-xs text-[#6B6860]">
              Range: {priceRangeLow.toLocaleString()} - {priceRangeHigh.toLocaleString()} · {gridLevels} levels
            </p>
            <span className={"font-mono text-xs px-1.5 py-0.5 rounded-full " + (connected ? "bg-green/10 text-green" : "bg-[#6B6860]/10 text-[#6B6860]")}>
              {connected ? "Live" : "Connecting..."}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-xl font-semibold text-charcoal">
            {livePrice ? "$" + livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "--"}
          </p>
          <p className={"font-mono text-xs " + (change24h >= 0 ? "text-green" : "text-crimson")}>
            {change24h >= 0 ? "+" : ""}{change24h.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D8D4CC" vertical={false} />
            <XAxis dataKey="time"
              tick={{ fontFamily: "JetBrains Mono", fontSize: 10, fill: "#6B6860" }}
              axisLine={false} tickLine={false} interval={7} />
            <YAxis domain={[yMin, yMax]}
              tick={{ fontFamily: "JetBrains Mono", fontSize: 10, fill: "#6B6860" }}
              axisLine={false} tickLine={false}
              tickFormatter={(v) => "$" + (+v).toLocaleString()} width={72} />
            <Tooltip content={<CustomTooltip />} />
            {levels.map((lvl) => (
              <ReferenceLine key={lvl} y={lvl}
                stroke={lvl < displayPrice ? "#1A6B3C" : "#1F3A8F"}
                strokeDasharray="4 4" strokeWidth={1} opacity={0.5} />
            ))}
            <ReferenceLine y={displayPrice} stroke="#161719" strokeWidth={1.5}
              label={{ value: "NOW", position: "right", fontFamily: "JetBrains Mono", fontSize: 9, fill: "#161719" }} />
            <Line type="monotone" dataKey="price" stroke="#1F3A8F" strokeWidth={2}
              dot={false} activeDot={{ r: 4, fill: "#1F3A8F", stroke: "#F0EDE7", strokeWidth: 2 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-5 mt-3 pt-3 border-t border-[#D8D4CC]">
        <div className="flex items-center gap-1.5">
          <div className="w-4 border-t-2 border-dashed border-green" />
          <span className="font-mono text-xs text-[#6B6860]">Buy levels</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 border-t-2 border-dashed border-navy" />
          <span className="font-mono text-xs text-[#6B6860]">Sell levels</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 border-t-2 border-charcoal" />
          <span className="font-mono text-xs text-[#6B6860]">Current price</span>
        </div>
      </div>
    </div>
  );
}