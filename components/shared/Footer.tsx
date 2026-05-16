"use client";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#D8D4CC] bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left — branding */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold text-charcoal tracking-tight">🍡</span>
          <span className="font-display font-semibold text-charcoal text-sm tracking-wide uppercase">
            Dango Grid Bot
          </span>
        </div>

        {/* Center — built by */}
        <p className="font-mono text-xs text-[#6B6860]">
          Built by{" "}
          <a
            href="https://x.com/olumi441"
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy font-medium hover:text-navy-dark underline underline-offset-2 transition-colors"
          >
            Abu Olumi
          </a>
        </p>

        {/* Right — links */}
        <div className="flex items-center gap-4">
          <a
            href="https://dango.exchange"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-[#6B6860] hover:text-charcoal transition-colors"
          >
            Dango Exchange ↗
          </a>
          <a
            href="https://docs.dango.exchange"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-[#6B6860] hover:text-charcoal transition-colors"
          >
            Docs ↗
          </a>
          <a
            href="https://github.com/2TheMoom"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-[#6B6860] hover:text-charcoal transition-colors"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
