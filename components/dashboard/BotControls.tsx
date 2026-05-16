"use client";

import type { BotStatus } from "@/app/dashboard/page";

interface Props {
  status: BotStatus;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

const STATUS_CONFIG = {
  idle: { label: "IDLE", dot: "bg-[#6B6860]", badge: "badge-idle" },
  running: { label: "RUNNING", dot: "bg-green animate-pulse", badge: "badge-running" },
  stopped: { label: "STOPPED", dot: "bg-crimson", badge: "badge-stopped" },
  error: { label: "ERROR", dot: "bg-crimson animate-pulse", badge: "badge-stopped" },
};

export default function BotControls({ status, onStart, onStop, onReset }: Props) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className={cfg.badge}>
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        <span>{cfg.label}</span>
      </div>
      {status !== "running" && (
        <button onClick={onStart}
          className="inline-flex items-center gap-1.5 bg-green text-white font-display font-semibold
                     text-sm uppercase tracking-wide px-4 py-1.5 rounded hover:bg-green-light active:scale-95 transition-all">
          ▶ Start
        </button>
      )}
      {status === "running" && (
        <button onClick={onStop}
          className="inline-flex items-center gap-1.5 bg-crimson text-white font-display font-semibold
                     text-sm uppercase tracking-wide px-4 py-1.5 rounded hover:bg-crimson-light active:scale-95 transition-all">
          ■ Stop
        </button>
      )}
      <button onClick={onReset} disabled={status === "running"} className="btn-secondary text-sm py-1.5 px-4">
        ↺ Reset
      </button>
    </div>
  );
}