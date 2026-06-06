"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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

export default function Navbar() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D8D4CC] bg-card/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <LogoIcon />
          <span className="font-display font-bold text-charcoal text-base tracking-tight uppercase group-hover:text-navy transition-colors">
            GRID<span className="text-navy font-light">ASHI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {!isDashboard && (
            <>
              <a href="#features" className="font-display font-medium text-sm text-[#6B6860] hover:text-charcoal transition-colors uppercase tracking-wide">Features</a>
              <a href="#how-it-works" className="font-display font-medium text-sm text-[#6B6860] hover:text-charcoal transition-colors uppercase tracking-wide">How it works</a>
              <a href="#stats" className="font-display font-medium text-sm text-[#6B6860] hover:text-charcoal transition-colors uppercase tracking-wide">Stats</a>
            </>
          )}
          {isDashboard && (
            <Link href="/" className="font-display font-medium text-sm text-[#6B6860] hover:text-charcoal transition-colors uppercase tracking-wide">
              Home
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {!isDashboard ? (
            <Link href="/dashboard" className="btn-primary text-sm">Launch App</Link>
          ) : (
            <div className="badge-running">
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
              Connected
            </div>
          )}
          <button className="md:hidden p-1.5 rounded text-[#6B6860] hover:text-charcoal" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              }
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[#D8D4CC] bg-card px-6 py-4 flex flex-col gap-3">
          <a href="#features" className="font-display font-medium text-sm text-charcoal uppercase tracking-wide" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#how-it-works" className="font-display font-medium text-sm text-charcoal uppercase tracking-wide" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#stats" className="font-display font-medium text-sm text-charcoal uppercase tracking-wide" onClick={() => setMenuOpen(false)}>Stats</a>
        </div>
      )}
    </header>
  );
}
