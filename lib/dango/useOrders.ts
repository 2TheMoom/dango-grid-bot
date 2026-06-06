"use client";
import { useEffect, useState } from "react";
import { getPublicClient } from "./client";

export type LiveOrder = {
  orderId: string;
  side: "BUY" | "SELL";
  price: number;
  size: number;
  status: "open" | "filled" | "cancelled";
  filledAt: number | null;
  pnl: number | null;
};

export async function fetchUserOrders(accountAddress: string): Promise<LiveOrder[]> {
  try {
    const client = getPublicClient();
    const result = await (client as any).getPerpsOrdersByUser({
      user: accountAddress,
    });
    const orders = result?.orders ?? result ?? [];
    return orders.map((o: any) => ({
      orderId: o.orderId ?? o.id ?? "",
      side: parseFloat(o.size ?? "0") >= 0 ? "BUY" : "SELL",
      price: parseFloat(o.limitPrice ?? o.price ?? "0"),
      size: Math.abs(parseFloat(o.size ?? "0")),
      status: o.status?.toLowerCase() ?? "open",
      filledAt: o.filledPrice ? parseFloat(o.filledPrice) : null,
      pnl: o.realizedPnl ? parseFloat(o.realizedPnl) : null,
    }));
  } catch (e) {
    console.error("fetchUserOrders error:", e);
    return [];
  }
}

export function useOrders(accountAddress: string | null) {
  const [orders, setOrders] = useState<LiveOrder[]>([]);

  useEffect(() => {
    if (!accountAddress) return;
    fetchUserOrders(accountAddress).then(setOrders);
    const interval = setInterval(() => fetchUserOrders(accountAddress).then(setOrders), 10000);
    return () => clearInterval(interval);
  }, [accountAddress]);

  return orders;
}
