"use client";
import { useOrders } from "@/lib/dango/useOrders";

interface Props {
  walletAddress: string;
  userId: string | null;
}

export default function OrderBook({ walletAddress, userId }: Props) {
  const orders = useOrders(walletAddress);
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-charcoal text-base">Open Orders</h2>
        <span className="font-mono text-xs text-[#6B6860]">{orders.length} orders</span>
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
            {orders.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center">
                <p className="font-mono text-xs text-[#6B6860]">No orders yet -- start the bot to place grid orders</p>
              </td></tr>
            ) : orders.map((o, i) => (
              <tr key={i} className="border-b border-[#D8D4CC]/50 hover:bg-background/50 transition-colors">
                <td className="py-2.5 pr-4"><span className={"font-mono text-xs font-semibold " + (o.side === "BUY" ? "text-green" : "text-crimson")}>{o.side}</span></td>
                <td className="py-2.5 pr-4"><span className="font-mono text-xs text-charcoal">{o.price ? "$" + o.price.toLocaleString() : "--"}</span></td>
                <td className="py-2.5 pr-4"><span className="font-mono text-xs text-charcoal">${o.size.toFixed(2)}</span></td>
                <td className="py-2.5 pr-4"><span className={"font-mono text-xs px-2 py-0.5 rounded " + (o.status === "filled" ? "bg-green/10 text-green" : o.status === "cancelled" ? "bg-crimson/10 text-crimson" : "bg-navy/10 text-navy")}>{o.status}</span></td>
                <td className="py-2.5"><span className="font-mono text-xs text-[#6B6860]">{o.filledAt ? "$" + o.filledAt.toLocaleString() : "--"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}