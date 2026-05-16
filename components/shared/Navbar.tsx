"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D8D4CC] bg-card/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl">🍡</span>
          <span className="font-display font-bold text-charcoal text-base tracking-tight uppercase group-hover:text-navy transition-colors">
            Dango<span className="text-navy">Grid</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {!isDashboard && (
            <>
              <a href="#features" className="font-display font-medium text-sm text-[#6B6860] hover:text-charcoal transition-colors uppercase tracking-wide">
                Features
              </a>
              <a href="#how-it-works" className="font-display font-medium text-sm text-[#6B6860] hover:text-charcoal transition-colors uppercase tracking-wide">
                How it works
              </a>
              <a href="#stats" className="font-display font-medium text-sm text-[#6B6860] hover:text-charcoal transition-colors uppercase tracking-wide">
                Stats
              </a>
            </>
          )}
          {isDashboard && (
            <Link href="/" className="font-display font-medium text-sm text-[#6B6860] hover:text-charcoal transition-colors uppercase tracking-wide">
              ← Home
            </Link>
          )}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          {!isDashboard ? (
            <Link href="/dashboard" className="btn-primary text-sm">
              Launch App
            </Link>
          ) : (
            <div className="badge-running">
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
              Connected
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-1.5 rounded text-[#6B6860] hover:text-charcoal"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
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
