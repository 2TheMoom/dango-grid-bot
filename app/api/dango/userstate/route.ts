import { queryApp, getAppConfig } from "@/lib/dango/graphql";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  if (!address) return NextResponse.json({ userState: null });
  try {
    const config = await getAppConfig();
    const perps = config?.addresses?.perps;
    if (!perps) return NextResponse.json({ userState: null });
    const res = await queryApp({
      wasmSmart: {
        contract: perps,
        msg: { userState: { user: address } },
      }
    });
    const s = res?.wasmSmart;
    if (!s) return NextResponse.json({ userState: null });
    return NextResponse.json({
      userState: {
        realizedPnl: parseFloat(s.realizedPnl ?? "0"),
        unrealizedPnl: parseFloat(s.unrealizedPnl ?? "0"),
        marginBalance: parseFloat(s.marginBalance ?? s.margin ?? s.balance ?? "0"),
        feesPaid: parseFloat(s.feesPaid ?? "0"),
      }
    });
  } catch (e: any) {
    return NextResponse.json({ userState: null, error: e?.message }, { status: 500 });
  }
}