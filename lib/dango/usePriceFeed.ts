"use client";
import { useEffect, useRef, useState } from "react";
import { getPublicClient } from "./client";

export type PairPrice = {
  pairId: string;
  price: number;
  change24h: number;
  volume24h: number;
};

export function usePriceFeed(pairIds: string[]) {
  const [prices, setPrices] = useState<Record<string, PairPrice>>({});
  const [connected, setConnected] = useState(false);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const client = getPublicClient();
    let mounted = true;

    const unsub = (client as any).allPerpsPairStatsSubscription({
      onData: (data: { allPerpsPairStats: any[] }) => {
        if (!mounted) return;
        const updated: Record<string, PairPrice> = {};
        for (const stat of data.allPerpsPairStats) {
          const id = stat.pairId as string;
          if (!pairIds.length || pairIds.includes(id)) {
            updated[id] = {
              pairId: id,
              price: parseFloat(stat.currentPrice ?? stat.price ?? "0"),
              change24h: parseFloat(stat.priceChange24H ?? "0"),
              volume24h: parseFloat(stat.volume24H ?? "0"),
            };
          }
        }
        if (Object.keys(updated).length > 0) {
          setPrices((prev) => ({ ...prev, ...updated }));
          setConnected(true);
        }
      },
      onError: (err: unknown) => {
        console.error("Price feed error:", err);
        setConnected(false);
      },
      httpInterval: 5000,
    });

    unsubRef.current = unsub;

    return () => {
      mounted = false;
      unsubRef.current?.();
    };
  }, []);

  return { prices, connected };
}
