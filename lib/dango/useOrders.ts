"use client";
import { useEffect, useState } from "react";
import { queryApp, getAppConfig } from "./graphql";

export type LiveOrder = {
  orderId: string;
  side: "BUY" | "SELL";
  price: number;
  size: number;
  status: "open" | "filled" | "cancelled";
  filledAt: number | null;
  pnl: number | null;
};

export function useOrders(address: string | null) {
  const [orders, setOrders] = useState<LiveOrder[]>([]);
  useEffect(() => {
    if (!address) return;
    const fetch_ = async () => {
      try {
        const config = await getAppConfig();
        const perps = config?.addresses?.perps;
        if (!perps) return;
        const res = await queryApp({
          wasmSmart: { contract: perps, msg: { ordersByUser: { user: address } } }
        });
        const raw = res?.wasmSmart ?? [];
        const list = Array.isArray(raw) ? raw : raw?.orders ?? [];
        setOrders(list.map((o: any) => ({
          orderId: o.orderId ?? o.id ?? "",
          side: parseFloat(o.size ?? "0") >= 0 ? "BUY" : "SELL",
          price: parseFloat(o.limitPrice ?? o.price ?? "0"),
          size: Math.abs(parseFloat(o.size ?? "0")),
          status: o.status?.toLowerCase() ?? "open",
          filledAt: o.filledPrice ? parseFloat(o.filledPrice) : null,
          pnl: o.realizedPnl ? parseFloat(o.realizedPnl) : null,
        })));
      } catch (e) {
        console.error("useOrders error:", e);
      }
    };
    fetch_();
    const i = setInterval(fetch_, 10000);
    return () => clearInterval(i);
  }, [address]);
  return orders;
}