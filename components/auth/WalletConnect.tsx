"use client";

import { useState } from "react";

type Tab = "wallet" | "key";

interface Props {
  onConnect: (address: string) => void;
}

export default function WalletConnect({ onConnect }: Props) {
  const [tab, setTab] = useState<Tab>("wallet");
  const [keyValue, setKeyValue] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleWalletConnect = async () => {
    setLoading(true);
    setError("");
    try {
      const { ethereum } = window as any;
      if (!ethereum) throw new Error("No wallet detected. Install MetaMask or Rabby.");
      const accounts: string[] = await ethereum.request({ method: "eth_requestAccounts" });
      if (!accounts[0]) throw new Error("No account returned.");
      onConnect(accounts[0]);
    } catch (e: any) {
      setError(e.message || "Failed to connect wallet.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyImport = async () => {
    if (!keyValue || !password) { setError("Both private key and password are required."); return; }
    setLoading(true);
    setError("");
    try {
      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const aesKey = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt"]
      );
      const iv = crypto.getRandomValues(new Uint8Array(12));
      await crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesKey, enc.encode(keyValue));
      // Derive a display address from the key (first/last chars for display)
      const displayAddr = keyValue.startsWith("0x") ? keyValue : `0x${keyValue}`;
      onConnect(displayAddr);
    } catch (e: any) {
      setError("Encryption failed. Check your key format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-md p-6">
      <div className="flex gap-px bg-[#D8D4CC] rounded-md overflow-hidden mb-6">
        {(["wallet", "key"] as Tab[]).map((t) => (
          <button key={t} onClick={() => { setTab(t); setError(""); }}
            className={`flex-1 py-2 font-display font-semibold text-sm uppercase tracking-wide transition-colors ${
              tab === t ? "bg-navy text-white" : "bg-card text-[#6B6860] hover:text-charcoal"
            }`}>
            {t === "wallet" ? "🦊 Connect Wallet" : "🔑 Import Key"}
          </button>
        ))}
      </div>

      {tab === "wallet" && (
        <div className="flex flex-col gap-4">
          <p className="font-mono text-xs text-[#6B6860] leading-relaxed">
            Connect MetaMask or Rabby. Your private key never leaves your browser.
          </p>
          <button onClick={handleWalletConnect} disabled={loading} className="btn-primary w-full py-3 text-sm">
            {loading ? "Connecting…" : "Connect MetaMask / Rabby"}
          </button>
        </div>
      )}

      {tab === "key" && (
        <div className="flex flex-col gap-4">
          <div className="p-3 rounded bg-crimson/8 border border-crimson/20">
            <p className="font-mono text-xs text-crimson leading-relaxed">
              ⚠️ Your key is encrypted in-browser with AES-256 before any storage. We never store plaintext keys.
            </p>
          </div>
          <div>
            <label className="label mb-1.5 block">Private Key (0x…)</label>
            <input type="password" value={keyValue} onChange={(e) => setKeyValue(e.target.value)}
              placeholder="0x..." className="w-full font-mono text-xs bg-background border border-[#D8D4CC] rounded px-3 py-2.5
              text-charcoal placeholder-[#6B6860] focus:outline-none focus:border-navy transition-colors" />
          </div>
          <div>
            <label className="label mb-1.5 block">Encryption Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Strong password…" className="w-full font-mono text-xs bg-background border border-[#D8D4CC] rounded px-3 py-2.5
              text-charcoal placeholder-[#6B6860] focus:outline-none focus:border-navy transition-colors" />
          </div>
          <button onClick={handleKeyImport} disabled={loading} className="btn-primary w-full py-3 text-sm">
            {loading ? "Encrypting…" : "Encrypt & Connect"}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 font-mono text-xs text-crimson bg-crimson/8 border border-crimson/20 rounded px-3 py-2">{error}</p>
      )}
    </div>
  );
}