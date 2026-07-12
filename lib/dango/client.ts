"use client";

import { createPublicClient, createSignerClient, createTransport, mainnet } from "@left-curve/sdk";
import type { Signer } from "@left-curve/types";

// Relative path so the browser resolves it against the current origin — the
// proxy hops server-side to Dango's API, which sends no Access-Control-Allow-Origin
// header and would otherwise be blocked by CORS on a direct browser fetch.
const PROXY_URL = "/api/proxy";

let _publicClient: ReturnType<typeof createPublicClient> | null = null;

export function getPublicClient() {
  if (_publicClient) return _publicClient;
  _publicClient = createPublicClient({
    chain: mainnet,
    transport: createTransport(PROXY_URL),
  });
  return _publicClient;
}

export function createDangoSignerClient(signer: Signer) {
  return createSignerClient({
    chain: mainnet,
    transport: createTransport(PROXY_URL),
    signer,
  });
}

export type DangoSignerClient = ReturnType<typeof createDangoSignerClient>;

export { mainnet };
