"use client";
import { useEffect, useState } from "react";
import { queryApp, getAppConfig } from "./graphql";

export type VaultData = {
  shareSupply: number;
  sharePrice: number;
  apy: number;
};

export function useVault() {
  const [vault, setVault] = useState<VaultData | null>(null);
  useEffect(() => {
    const fetch_ = async () => {
      try {
        const config = await getAppConfig();
        const perps = config?.addresses?.perps;
        if (!perps) return;
        const res = await queryApp({ wasmSmart: { contract: perps, msg: { state: {} } } });
        const s = res?.wasmSmart;
        if (!s) return;
        setVault({
          shareSupply: parseFloat(s.vaultShareSupply ?? "0"),
          sharePrice: 1,
          apy: 0,
        });
      } catch (e) {
        console.error("useVault error:", e);
      }
    };
    fetch_();
    const i = setInterval(fetch_, 30000);
    return () => clearInterval(i);
  }, []);
  return vault;
}