import { queryApp, getAppConfig } from "@/lib/dango/graphql";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  if (!address) return NextResponse.json({ orders: [] });
  try {
    const config = await getAppConfig();
    const perps = config?.addresses?.perps;
    if (!perps) return NextResponse.json({ orders: [] });
    const res = await queryApp({
      wasmSmart: {
        contract: perps,
        msg: { ordersByUser: { user: address } },
      }
    });
    const raw = res?.wasmSmart ?? [];
    const orders = (Array.isArray(raw) ? raw : raw?.orders ?? []).map((o: any) => ({
      orderId: o.orderId ?? o.id ?? "",
      side: parseFloat(o.size ?? "0") >= 0 ? "BUY" : "SELL",
      price: parseFloat(o.limitPrice ?? o.price ?? "0"),
      size: Math.abs(parseFloat(o.size ?? "0")),
      status: o.status?.toLowerCase() ?? "open",
      filledAt: o.filledPrice ? parseFloat(o.filledPrice) : null,
      pnl: o.realizedPnl ? parseFloat(o.realizedPnl) : null,
    }));
    return NextResponse.json({ orders });
  } catch (e: any) {
    return NextResponse.json({ orders: [], error: e?.message }, { status: 500 });
  }
}