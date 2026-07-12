"use client";

import type { DangoSession } from "./signerStore";
import type { Strategy } from "@/app/dashboard/page";

export type GridOrderPlan = {
  pairId: string;
  price: number;
  /** Signed size: positive = long/buy, negative = short/sell. */
  size: string;
};

/**
 * Evenly spaces `gridLevels` limit orders across [priceRangeLow, priceRangeHigh].
 * Levels below the current mid price are buys (long), levels above are sells
 * (short) — the standard grid-trading ladder that profits from oscillation.
 */
export function buildGridLadder(strategy: Strategy, midPrice: number): GridOrderPlan[] {
  const { priceRangeLow, priceRangeHigh, gridLevels, capitalAllocation, leverage, asset } = strategy;
  if (gridLevels < 2 || priceRangeHigh <= priceRangeLow || midPrice <= 0) return [];

  const step = (priceRangeHigh - priceRangeLow) / (gridLevels - 1);
  const notionalPerLevel = (capitalAllocation * leverage) / gridLevels;

  const orders: GridOrderPlan[] = [];
  for (let i = 0; i < gridLevels; i++) {
    const price = priceRangeLow + step * i;
    if (price <= 0) continue;
    const isBuy = price < midPrice;
    const size = notionalPerLevel / price;
    orders.push({
      pairId: asset,
      price,
      size: (isBuy ? size : -size).toFixed(6),
    });
  }
  return orders;
}

export async function getMidPrice(session: DangoSession, pairId: string): Promise<number | null> {
  const stats = await session.signerClient.getAllPerpsPairStats();
  const stat = stats?.find((s) => s.pairId === pairId);
  return stat?.currentPrice ? parseFloat(stat.currentPrice) : null;
}

export async function placeLimitOrder(session: DangoSession, plan: GridOrderPlan) {
  return session.signerClient.submitPerpsOrder({
    sender: session.address,
    pairId: plan.pairId,
    size: plan.size,
    reduceOnly: false,
    kind: { limit: { limitPrice: plan.price.toFixed(6), timeInForce: "GTC" } },
  });
}

/** Places the full ladder once. Best-effort: one failing level doesn't block the rest. */
export async function placeGridOrders(session: DangoSession, strategy: Strategy) {
  const midPrice = await getMidPrice(session, strategy.asset);
  if (midPrice == null) throw new Error(`No price found for ${strategy.asset}`);

  const plan = buildGridLadder(strategy, midPrice);
  const results = await Promise.allSettled(plan.map((order) => placeLimitOrder(session, order)));

  const failed = results.filter((r) => r.status === "rejected") as PromiseRejectedResult[];
  return { placed: results.length - failed.length, failed: failed.map((f) => f.reason?.message ?? String(f.reason)) };
}

/** Cancels every open order for the session's account (account-wide — the SDK has no per-pair bulk cancel). */
export async function cancelAllOrders(session: DangoSession) {
  return session.signerClient.cancelPerpsOrder({ sender: session.address, request: "all" });
}

const MAINTENANCE_INTERVAL_MS = 30_000;

/**
 * Periodically refills grid levels that have been filled/canceled since the
 * last check. Does not reprice or cancel existing resting orders — it only
 * tops up missing levels, so it's safe to call repeatedly.
 */
export function startGridMaintenance(
  session: DangoSession,
  strategy: Strategy,
  onError: (err: Error) => void
): () => void {
  let cancelled = false;

  const tick = async () => {
    if (cancelled) return;
    try {
      const [midPrice, openOrders] = await Promise.all([
        getMidPrice(session, strategy.asset),
        session.signerClient.getPerpsOrdersByUser({ user: session.address }),
      ]);
      if (midPrice == null) return;

      const openPrices = new Set(
        Object.values(openOrders)
          .filter((o) => o.pairId === strategy.asset)
          .map((o) => parseFloat(o.limitPrice).toFixed(2))
      );

      const desired = buildGridLadder(strategy, midPrice);
      const missing = desired.filter((o) => !openPrices.has(o.price.toFixed(2)));
      await Promise.allSettled(missing.map((order) => placeLimitOrder(session, order)));
    } catch (e: any) {
      onError(e instanceof Error ? e : new Error(String(e)));
    }
  };

  const intervalId = setInterval(tick, MAINTENANCE_INTERVAL_MS);
  tick();

  return () => {
    cancelled = true;
    clearInterval(intervalId);
  };
}
