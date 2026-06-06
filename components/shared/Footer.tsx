"use client";

const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="7" fill="#1F3A8F"/>
    <line x1="11" y1="4" x2="11" y2="28" stroke="#E9E6DF" stroke-width="0.6" stroke-opacity="0.2"/>
    <line x1="21" y1="4" x2="21" y2="28" stroke="#E9E6DF" stroke-width="0.6" stroke-opacity="0.2"/>
    <line x1="4" y1="11" x2="28" y2="11" stroke="#E9E6DF" stroke-width="0.6" stroke-opacity="0.2"/>
    <line x1="4" y1="21" x2="28" y2="21" stroke="#E9E6DF" stroke-width="0.6" stroke-opacity="0.2"/>
    <rect x="5" y="22" width="4" height="5" rx="1" fill="#1A6B3C"/>
    <rect x="11" y="18" width="4" height="9" rx="1" fill="#1A6B3C"/>
    <rect x="17" y="13" width="4" height="14" rx="1" fill="#1A6B3C"/>
    <rect x="23" y="8" width="4" height="19" rx="1" fill="#F0EDE7"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#D8D4CC] bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LogoIcon />
          <span className="font-display font-bold text-charcoal text-sm tracking-tight uppercase">
            GRID<span className="text-navy font-light">ASHI</span>
          </span>
        </div>

        <p className="font-mono text-xs text-[#6B6860]">
          Built by{" "}
          
            href="https://x.com/olumi441"
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy font-medium hover:text-navy-dark underline underline-offset-2 transition-colors"
          >
            Abu Olumi
          </a>
        </p>

        <div className="flex items-center gap-4">
          <a href="https://dango.exchange" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-[#6B6860] hover:text-charcoal transition-colors">Dango Exchange</a>
          <a href="https://docs.dango.exchange" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-[#6B6860] hover:text-charcoal transition-colors">Docs</a>
          <a href="https://github.com/2TheMoom" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-[#6B6860] hover:text-charcoal transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
