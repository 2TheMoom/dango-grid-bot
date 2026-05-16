"use client";

interface Props {
  walletAddress: string;
  userId: string | null;
}

export default function OrderBook({ walletAddress, userId }: Props) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-charcoal text-base">Open Orders</h2>
        <span className="font-mono text-xs text-[#6B6860]">0 orders</span>
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
            <tr>
              <td colSpan={5} className="py-8 text-center">
                <p className="font-mono text-xs text-[#6B6860]">
                  No orders yet — start the bot to begin placing grid orders
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}