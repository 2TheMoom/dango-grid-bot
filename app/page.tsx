import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const TICKER_ITEMS = [
  "ETH-USD  $2,547.32  +1.24%",
  "BTC-USD  $67,210.00  +0.88%",
  "SOL-USD  $165.44  -0.32%",
  "ARB-USD  $1.12  +2.10%",
  "OP-USD  $2.38  +1.75%",
  "AVAX-USD  $38.92  +0.54%",
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Automated Grid Trading",
    desc: "Set your range once. The bot places and replaces limit orders 24/7, capturing profit on every price oscillation — no manual intervention needed.",
  },
  {
    icon: "📊",
    title: "Volume Farming",
    desc: "Generate $3K–$5K weekly trading volume to climb Dango's epoch leaderboard and unlock lootbox milestones at $25K, $100K, and beyond.",
  },
  {
    icon: "🎯",
    title: "Airdrop Points Engine",
    desc: "Every epoch you trade earns DNG points. Combine active trading with DLP vault deposits to maximise your share of the 50% community allocation.",
  },
  {
    icon: "🛡️",
    title: "Capital Preservation",
    desc: "Configurable stop-loss floors, automatic out-of-range pausing, and hard leverage caps keep your capital safe even during volatile markets.",
  },
  {
    icon: "🔑",
    title: "Non-Custodial",
    desc: "Your keys never touch our servers. Connect via MetaMask/Rabby for browser-side signing, or use client-side AES-256 encryption for key storage.",
  },
  {
    icon: "📈",
    title: "Live Dashboard",
    desc: "Real-time grid visualisation, PnL tracking, open order book, epoch progress, and DLP vault stats — all in one clean interface.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Connect Your Wallet",
    desc: "Link MetaMask, Rabby, or paste an encrypted private key. Your Dango account address is detected automatically.",
  },
  {
    n: "02",
    title: "Configure Your Strategy",
    desc: "Pick your asset, set your price range, choose leverage (1×–10×), define grid levels, and set your stop-loss floor.",
  },
  {
    n: "03",
    title: "Run & Earn",
    desc: "Hit Start. The bot places orders, detects fills, replaces them, and logs every cycle. Check back to see your volume and PnL grow.",
  },
];

const PLATFORM_STATS = [
  { label: "Active Bots", value: "—", mono: true },
  { label: "Total Volume (Epoch)", value: "—", mono: true },
  { label: "Avg. Weekly Volume / User", value: "$3K–$5K", mono: true },
  { label: "DNG Points Earned", value: "—", mono: true },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── TICKER ── */}
      <div className="w-full bg-navy overflow-hidden py-2 border-b border-navy-dark">
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="font-mono text-xs text-white/80 mx-8">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden">
        {/* Decorative background grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(var(--navy) 1px, transparent 1px), linear-gradient(90deg, var(--navy) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Accent orb */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-navy/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-navy/8 border border-navy/20 rounded-full px-4 py-1.5 mb-8 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            <span className="font-mono text-xs text-navy font-medium uppercase tracking-widest">
              Live on Dango Mainnet
            </span>
          </div>

          <h1
            className="font-display font-extrabold text-charcoal mb-6 animate-fade-up delay-100"
            style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)", lineHeight: "0.95", letterSpacing: "-0.02em" }}
          >
            AUTOMATE YOUR
            <br />
            <span className="text-navy">DANGO GRID</span>
            <br />
            STRATEGY
          </h1>

          <p className="font-mono text-sm text-[#6B6860] max-w-xl mx-auto leading-relaxed mb-10 animate-fade-up delay-200">
            Farm $3K–$5K weekly trading volume, earn DNG airdrop points, and
            generate profit — all from a single non-custodial dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up delay-300">
            <Link href="/dashboard" className="btn-primary text-base px-8 py-3">
              Launch App →
            </Link>
            <a
              href="https://docs.dango.exchange"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-base px-8 py-3"
            >
              Read Docs
            </a>
          </div>

          {/* Quick stats row */}
          <div className="mt-16 grid grid-cols-3 gap-px bg-[#D8D4CC] rounded-lg overflow-hidden border border-[#D8D4CC] animate-fade-up delay-400">
            {[
              { label: "Weekly Volume Target", value: "$3K – $5K" },
              { label: "Max Leverage", value: "10×" },
              { label: "DNG Supply to Community", value: "50%" },
            ].map((s) => (
              <div key={s.label} className="bg-card px-6 py-5 text-center">
                <p className="font-mono font-semibold text-navy text-2xl mb-1">{s.value}</p>
                <p className="label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="px-6 py-24 bg-card border-y border-[#D8D4CC]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="label mb-3">What it does</p>
            <h2
              className="font-display font-bold text-charcoal"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.01em" }}
            >
              Everything you need to farm
              <br />
              <span className="text-navy">Dango like a pro</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="card p-6 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="text-2xl mb-4">{f.icon}</div>
                <h3 className="font-display font-semibold text-charcoal text-lg mb-2 group-hover:text-navy transition-colors">
                  {f.title}
                </h3>
                <p className="font-mono text-xs text-[#6B6860] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="label mb-3">Three steps</p>
            <h2
              className="font-display font-bold text-charcoal"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.01em" }}
            >
              From wallet to{" "}
              <span className="text-navy">running bot</span>
              <br />
              in minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-[#D8D4CC] z-0 -translate-x-1/2" />
                )}
                <div className="relative z-10 card p-6">
                  <div className="font-display font-extrabold text-navy/20 text-5xl mb-4 leading-none">
                    {s.n}
                  </div>
                  <h3 className="font-display font-semibold text-charcoal text-xl mb-2">{s.title}</h3>
                  <p className="font-mono text-xs text-[#6B6860] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM STATS ── */}
      <section id="stats" className="px-6 py-24 bg-card border-y border-[#D8D4CC]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="label mb-3">Platform stats</p>
            <h2
              className="font-display font-bold text-charcoal"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.01em" }}
            >
              Live numbers from the{" "}
              <span className="text-navy">Dango network</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PLATFORM_STATS.map((s) => (
              <div key={s.label} className="card p-6">
                <p
                  className={`text-3xl font-bold mb-2 ${s.mono ? "font-mono text-navy" : "font-display text-charcoal"}`}
                >
                  {s.value}
                </p>
                <p className="label">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Risk disclaimer */}
          <div className="mt-8 p-4 rounded-lg bg-crimson/5 border border-crimson/20">
            <p className="font-mono text-xs text-crimson leading-relaxed">
              <strong>Risk Disclosure:</strong> Grid trading involves financial risk. Past performance does not guarantee future results.
              Never deposit more than you can afford to lose. This platform is non-custodial — you are solely responsible for your funds.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="font-display font-extrabold text-charcoal mb-6"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em", lineHeight: "0.95" }}
          >
            READY TO START
            <br />
            <span className="text-navy">FARMING?</span>
          </h2>
          <p className="font-mono text-sm text-[#6B6860] mb-8 max-w-md mx-auto leading-relaxed">
            Connect your wallet, configure your grid, and let the bot run. Your
            DNG airdrop allocation is counting every volume epoch.
          </p>
          <Link href="/dashboard" className="btn-primary text-base px-10 py-3.5">
            Launch App — It's Free →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
