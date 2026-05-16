"use client";

const MOCK_ORDERS = [
  { side: "BUY",  price: 2480, size: 30, status: "Open",   filledAt: null },
  { side: "BUY",  price: 2460, size: 30, status: "Open",   filledAt: null },
  { side: "SELL", price: 2540, size: 30, status: "Filled", filledAt: 2541.20 },
  { side: "SELL", price: 2560, size: 30, status: "Open",   filledAt: null },
  { side: "BUY",  price: 2440, size: 30, status: "Open",   filledAt: null },
  { side: "SELL", price: 2580, size: 30, status: "Open",   filledAt: null },
];

export default function OrderBook({ walletAddress }: { walletAddress: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-charcoal text-base">Open Orders</h2>
        <span className="font-mono text-xs text-[#6B6860]">{MOCK_ORDERS.length} orders</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#D8D4CC]">
              {["Side", "Price", "Size ($)", "Status", "Filled At"].map((h) => (
                <th key={h} className="label pb-2 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_ORDERS.map((o, i) => (
              <tr key={i} className="border-b border-[#D8D4CC]/50 hover:bg-background/50 transition-colors">
                <td className="py-2.5 pr-4">
                  <span className={`font-mono text-xs font-semibold ${o.side === "BUY" ? "text-green" : "text-crimson"}`}>
                    {o.side}
                  </span>
                </td>
                <td className="py-2.5 pr-4">
                  <span className="font-mono text-xs text-charcoal">${o.price.toLocaleString()}</span>
                </td>
                <td className="py-2.5 pr-4">
                  <span className="font-mono text-xs text-charcoal">${o.size}</span>
                </td>
                <td className="py-2.5 pr-4">
                  <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                    o.status === "Filled" ? "bg-green/10 text-green" : "bg-navy/10 text-navy"
                  }`}>
                    {o.status}
                  </span>
                </td>
                <td className="py-2.5">
                  <span className="font-mono text-xs text-[#6B6860]">
                    {o.filledAt ? `$${o.filledAt}` : "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}