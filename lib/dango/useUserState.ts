"use client";
import { useEffect, useState } from "react";
import { queryApp, getAppConfig } from "./graphql";

export type UserState = {
  realizedPnl: number;
  unrealizedPnl: number;
  marginBalance: number;
  feesPaid: number;
};

export function useUserState(address: string | null) {
  const [userState, setUserState] = useState<UserState | null>(null);
  useEffect(() => {
    if (!address) return;
    const fetch_ = async () => {
      try {
        const config = await getAppConfig();
        const perps = config?.addresses?.perps;
        if (!perps) return;
        const res = await queryApp({
          wasmSmart: { contract: perps, msg: { userState: { user: address } } }
        });
        const s = res?.wasmSmart;
        if (!s) return;
        setUserState({
          realizedPnl: parseFloat(s.realizedPnl ?? "0"),
          unrealizedPnl: parseFloat(s.unrealizedPnl ?? "0"),
          marginBalance: parseFloat(s.marginBalance ?? s.margin ?? s.balance ?? "0"),
          feesPaid: parseFloat(s.feesPaid ?? "0"),
        });
      } catch (e) {
        console.error("useUserState error:", e);
      }
    };
    fetch_();
    const i = setInterval(fetch_, 15000);
    return () => clearInterval(i);
  }, [address]);
  return userState;
}