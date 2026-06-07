import { queryApp, getAppConfig } from "@/lib/dango/graphql";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const config = await getAppConfig();
    const perps = config?.addresses?.perps;
    if (!perps) return NextResponse.json({ error: "No perps contract" }, { status: 500 });
    const state = await queryApp({ wasmSmart: { contract: perps, msg: { state: {} } } });
    const vaultState = state?.wasmSmart;
    return NextResponse.json({
      shareSupply: parseFloat(vaultState?.vaultShareSupply ?? "0"),
      sharePrice: 1,
      apy: 0,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}