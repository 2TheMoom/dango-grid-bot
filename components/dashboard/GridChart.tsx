"use client";

import {
  ComposedChart, Line, ReferenceLine, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import type { Strategy, BotStatus } from "@/app/dashboard/page";

function generatePriceData(low: number, high: number, points = 48) {
  const mid = (low + high) / 2;
  const range = high - low;
  let price = mid;
  return Array.from({ length: points }, (_, i) => {
    price += (Math.random() - 0.5) * range * 0.08;
    price = Math.max(low * 0.97, Math.min(high * 1.03, price));
    const h = Math.floor(i / 2);
    const m = i % 2 === 0 ? "00" : "30";
    return { time: `${h.toString().padStart(2, "0")}:${m}`, price: +price.toFixed(2) };
  });
}

function getGridLevels(low: number, high: number, n: number) {
  const step = (high - low) / (n - 1);
  return Array.from({ length: n }, (_, i) => +(low + step * i).toFixed(2));
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs font-mono shadow-card-hover">
      <p className="text-[#6B6860]">{payload[0]?.payload?.time}</p>
      <p className="text-charcoal font-semibold">${payload[0]?.value?.toLocaleString()}</p>
    </div>
  );
};

export default function GridChart({ strategy, botStatus }: { strategy: Strategy; botStatus: BotStatus }) {
  const { priceRangeLow, priceRangeHigh, gridLevels } = strategy;
  const data = generatePriceData(priceRangeLow, priceRangeHigh);
  const levels = getGridLevels(priceRangeLow, priceRangeHigh, gridLevels);
  const currentPrice = data[data.length - 1]?.price ?? (priceRangeLow + priceRangeHigh) / 2;
  const yMin = priceRangeLow * 0.97;
  const yMax = priceRangeHigh * 1.03;

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-display font-semibold text-charcoal text-lg">
            {strategy.asset.replace("perp/", "").toUpperCase()} Grid
          </h2>
          <p className="font-mono text-xs text-[#6B6860] mt-0.5">
            Range: ${priceRangeLow.toLocaleString()} – ${priceRangeHigh.toLocaleString()} · {gridLevels} levels
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-xl font-semibold text-charcoal">${currentPrice.toLocaleString()}</p>
          <p className="font-mono text-xs text-green">↑ +1.24%</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D8D4CC" vertical={false} />
            <XAxis dataKey="time"
              tick={{ fontFamily: "JetBrains Mono", fontSize: 10, fill: "#6B6860" }}
              axisLine={false} tickLine={false} interval={7} />
            <YAxis domain={[yMin, yMax]}
              tick={{ fontFamily: "JetBrains Mono", fontSize: 10, fill: "#6B6860" }}
              axisLine={false} tickLine={false}
              tickFormatter={(v) => `$${(+v).toLocaleString()}`} width={72} />
            <Tooltip content={<CustomTooltip />} />

            {levels.map((lvl) => (
              <ReferenceLine key={lvl} y={lvl}
                stroke={lvl < currentPrice ? "#1A6B3C" : "#1F3A8F"}
                strokeDasharray="4 4" strokeWidth={1} opacity={0.5} />
            ))}

            <ReferenceLine y={currentPrice} stroke="#161719" strokeWidth={1.5}
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