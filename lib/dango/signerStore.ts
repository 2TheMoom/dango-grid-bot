"use client";

import { useSyncExternalStore } from "react";
import { PrivateKeySigner, isValidAddress } from "@left-curve/sdk";
import type { Address } from "@left-curve/types";
import { createDangoSignerClient, type DangoSignerClient } from "./client";

export type DangoSession = {
  signer: PrivateKeySigner;
  signerClient: DangoSignerClient;
  address: Address;
};

// Deliberately in-memory only (module-level variable, never localStorage/
// IndexedDB/cookies) — the private key must not survive a page refresh or be
// recoverable from disk. Lost on reload by design; the user re-imports it.
let _session: DangoSession | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function setDangoSession(privateKeyHex: string, addressInput: string): DangoSession {
  const hex = privateKeyHex.startsWith("0x") ? privateKeyHex.slice(2) : privateKeyHex;
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new Error("Private key must be 32 bytes of hex (64 hex characters).");
  }
  const address = (addressInput.startsWith("0x") ? addressInput : "0x" + addressInput) as Address;
  if (!isValidAddress(address)) {
    throw new Error("Dango account address must be 20 bytes of hex (0x + 40 hex characters).");
  }

  const bytes = new Uint8Array(hex.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
  const signer = PrivateKeySigner.fromPrivateKey(bytes);
  const signerClient = createDangoSignerClient(signer);
  _session = { signer, signerClient, address };
  emit();
  return _session;
}

export function clearDangoSession() {
  _session = null;
  emit();
}

export function getDangoSession() {
  return _session;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useDangoSession() {
  return useSyncExternalStore(subscribe, getDangoSession, () => null);
}
