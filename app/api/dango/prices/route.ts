import { gql } from "@/lib/dango/graphql";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await gql(`
      query AllPerpsPairStats {
        allPerpsPairStats {
          pairId
          currentPrice
          price24HAgo
          volume24H
          priceChange24H
        }
      }
    `);
    const prices: Record<string, any> = {};
    for (const s of data?.allPerpsPairStats ?? []) {
      prices[s.pairId] = {
        pairId: s.pairId,
        price: parseFloat(s.currentPrice ?? "0"),
        change24h: parseFloat(s.priceChange24H ?? "0"),
        volume24h: parseFloat(s.volume24H ?? "0"),
      };
    }
    return NextResponse.json({ prices });
  } catch (e: any) {
    return NextResponse.json({ prices: {}, error: e?.message }, { status: 500 });
  }
}