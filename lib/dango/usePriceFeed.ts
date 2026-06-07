"use client";
import { useEffect, useState } from "react";
import { gql } from "./graphql";

export type PairPrice = {
  pairId: string;
  price: number;
  change24h: number;
  volume24h: number;
};

export function usePriceFeed(pairIds: string[]) {
  const [prices, setPrices] = useState<Record<string, PairPrice>>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchPrices = async () => {
      try {
        const data = await gql(`
          query { allPerpsPairStats {
            pairId currentPrice priceChange24H volume24H
          }}
        `);
        if (!mounted) return;
        const updated: Record<string, PairPrice> = {};
        for (const s of data?.allPerpsPairStats ?? []) {
          updated[s.pairId] = {
            pairId: s.pairId,
            price: parseFloat(s.currentPrice ?? "0"),
            change24h: parseFloat(s.priceChange24H ?? "0"),
            volume24h: parseFloat(s.volume24H ?? "0"),
          };
        }
        setPrices(updated);
        setConnected(true);
      } catch {
        if (mounted) setConnected(false);
      }
    };
    fetchPrices();
    const i = setInterval(fetchPrices, 5000);
    return () => { mounted = false; clearInterval(i); };
  }, []);

  return { prices, connected };
}