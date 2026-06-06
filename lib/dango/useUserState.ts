"use client";
import { useEffect, useState } from "react";
import { getPublicClient } from "./client";

export type UserState = {
  realizedPnl: number;
  unrealizedPnl: number;
  marginBalance: number;
  feesPaid: number;
};

export async function fetchUserState(accountAddress: string): Promise<UserState | null> {
  try {
    const client = getPublicClient();
    const state = await (client as any).getPerpsUserState({ user: accountAddress });
    if (!state) return null;
    return {
      realizedPnl: parseFloat(state.realizedPnl ?? "0"),
      unrealizedPnl: parseFloat(state.unrealizedPnl ?? "0"),
      marginBalance: parseFloat(state.marginBalance ?? state.balance ?? "0"),
      feesPaid: parseFloat(state.feesPaid ?? "0"),
    };
  } catch (e) {
    console.error("fetchUserState error:", e);
    return null;
  }
}

export function useUserState(accountAddress: string | null) {
  const [userState, setUserState] = useState<UserState | null>(null);

  useEffect(() => {
    if (!accountAddress) return;
    fetchUserState(accountAddress).then(setUserState);
    const interval = setInterval(() => fetchUserState(accountAddress).then(setUserState), 15000);
    return () => clearInterval(interval);
  }, [accountAddress]);

  return userState;
}
