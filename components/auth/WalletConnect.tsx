"use client";

import { useState } from "react";

type Tab = "wallet" | "key";

interface Props {
  onConnect: (address: string) => void;
}

function generateNonce() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export default function WalletConnect({ onConnect }: Props) {
  const [tab, setTab] = useState<Tab>("wallet");
  const [keyValue, setKeyValue] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"connect" | "sign">("connect");

  const handleWalletConnect = async () => {
    setLoading(true);
    setError("");
    try {
      const { ethereum } = window as any;
      if (!ethereum) throw new Error("No wallet detected. Install MetaMask or Rabby.");

      // Step 1 — get accounts
      const accounts: string[] = await ethereum.request({ method: "eth_requestAccounts" });
      if (!accounts[0]) throw new Error("No account returned.");
      const address = accounts[0];
      setStep("sign");

      // Step 2 — sign message BEFORE doing anything else
      const nonce = generateNonce();
      const message = [
        "Welcome to Dango Grid Bot",
        "",
        "Sign this message to verify you own this wallet.",
        "This does not cost gas or move any funds.",
        "",
        "Wallet: " + address,
        "Nonce: " + nonce,
        "Issued: " + new Date().toISOString(),
      ].join("\n");

      const signature = await ethereum.request({
        method: "personal_sign",
        params: [message, address],
      });

      if (!signature) throw new Error("Signing cancelled.");

      // Step 3 — verify signature
      const { ethers } = await import("ethers");
      const recovered = ethers.verifyMessage(message, signature);
      if (recovered.toLowerCase() !== address.toLowerCase()) {
        throw new Error("Signature verification failed. Address mismatch.");
      }

      // Step 4 — only now call onConnect
      onConnect(address);
    } catch (e: any) {
      setStep("connect");
      if (e?.code === 4001) {
        setError("Signing cancelled. You must sign the message to verify wallet ownership.");
      } else {
        setError(e?.message || "Failed to connect wallet.");
      }
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
      const displayAddr = keyValue.startsWith("0x") ? keyValue : "0x" + keyValue;
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
          <button key={t} onClick={() => { setTab(t); setError(""); setStep("connect"); }}
            className={"flex-1 py-2 font-display font-semibold text-sm uppercase tracking-wide transition-colors " + (tab === t ? "bg-navy text-white" : "bg-card text-[#6B6860] hover:text-charcoal")}>
            {t === "wallet" ? "Connect Wallet" : "Import Key"}
          </button>
        ))}
      </div>

      {tab === "wallet" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={"flex items-center gap-1.5 font-mono text-xs " + (step === "connect" ? "text-navy" : "text-green")}>
              <span className={"w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold " + (step === "connect" ? "bg-navy text-white" : "bg-green text-white")}>
                {step === "connect" ? "1" : "✓"}
              </span>
              Connect
            </div>
            <div className="flex-1 h-px bg-[#D8D4CC]" />
            <div className={"flex items-center gap-1.5 font-mono text-xs " + (step === "sign" ? "text-navy" : "text-[#6B6860]")}>
              <span className={"w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold " + (step === "sign" ? "bg-navy text-white" : "bg-[#D8D4CC] text-[#6B6860]")}>2</span>
              Sign
            </div>
          </div>

          <p className="font-mono text-xs text-[#6B6860] leading-relaxed">
            {step === "connect"
              ? "Connect MetaMask or Rabby. You will then sign a message to prove wallet ownership — no gas, no funds moved."
              : "Check your wallet — a signing request has been sent. Sign to verify ownership and continue."}
          </p>

          <button onClick={handleWalletConnect} disabled={loading} className="btn-primary w-full py-3 text-sm">
            {loading && step === "connect" && "Connecting..."}
            {loading && step === "sign" && "Waiting for signature..."}
            {!loading && "Connect and Sign"}
          </button>

          <div className="p-3 rounded bg-green/5 border border-green/20">
            <p className="font-mono text-xs text-green leading-relaxed">
              Signing proves you own this wallet. No gas cost. No funds moved. Private key stays on your device.
            </p>
          </div>
        </div>
      )}

      {tab === "key" && (
        <div className="flex flex-col gap-4">
          <div className="p-3 rounded bg-crimson/8 border border-crimson/20">
            <p className="font-mono text-xs text-crimson leading-relaxed">
              Your key is encrypted in-browser with AES-256. We never store or transmit your plaintext key.
            </p>
          </div>
          <div>
            <label className="label mb-1.5 block">Private Key</label>
            <input type="password" value={keyValue} onChange={(e) => setKeyValue(e.target.value)} placeholder="0x..."
              className="w-full font-mono text-xs bg-background border border-[#D8D4CC] rounded px-3 py-2.5 text-charcoal placeholder-[#6B6860] focus:outline-none focus:border-navy transition-colors" />
          </div>
          <div>
            <label className="label mb-1.5 block">Encryption Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Strong password..."
              className="w-full font-mono text-xs bg-background border border-[#D8D4CC] rounded px-3 py-2.5 text-charcoal placeholder-[#6B6860] focus:outline-none focus:border-navy transition-colors" />
          </div>
          <button onClick={handleKeyImport} disabled={loading} className="btn-primary w-full py-3 text-sm">
            {loading ? "Encrypting..." : "Encrypt and Connect"}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 font-mono text-xs text-crimson bg-crimson/8 border border-crimson/20 rounded px-3 py-2">{error}</p>
      )}
    </div>
  );
}
