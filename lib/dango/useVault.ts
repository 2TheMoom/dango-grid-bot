"use client";
import { useEffect, useState } from "react";
import { getPublicClient } from "./client";

export type VaultData = {
  totalLiquidity: number;
  userDeposit: number;
  sharePrice: number;
  apy: number;
};

export async function fetchVaultState(): Promise<VaultData | null> {
  try {
    const client = getPublicClient();
    const state = await (client as any).getPerpsVaultState({});
    return {
      totalLiquidity: parseFloat(state.totalLiquidity ?? state.liquidity ?? "0"),
      userDeposit: 0,
      sharePrice: parseFloat(state.sharePrice ?? "1"),
      apy: parseFloat(state.apy ?? "0"),
    };
  } catch (e) {
    console.error("fetchVaultState error:", e);
    return null;
  }
}

export function useVault() {
  const [vault, setVault] = useState<VaultData | null>(null);

  useEffect(() => {
    fetchVaultState().then(setVault);
    const interval = setInterval(() => fetchVaultState().then(setVault), 30000);
    return () => clearInterval(interval);
  }, []);

  return vault;
}
