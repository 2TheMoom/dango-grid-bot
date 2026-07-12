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
  { icon: "⚡", title: "Grid Trading", desc: "Places limit buy/sell orders across a price range. Captures profit from every price oscillation 24/7." },
  { icon: "👁️", title: "Watch Trading", desc: "Monitors momentum via EMA crossovers and RSI signals. Enters in trend direction using limit orders." },
  { icon: "📊", title: "Volume Tiers", desc: "Choose your weekly target from $3K to $1M. The bot scales leverage and order sizing automatically." },
  { icon: "💸", title: "Lowest Fees", desc: "All orders placed as limit maker orders — never market orders. Significantly lower fees than competing bots." },
  { icon: "🎯", title: "Airdrop Points Engine", desc: "Every epoch you trade earns DNG points. Combine trading with DLP vault deposits to maximise your share." },
  { icon: "🔑", title: "Signed Auth", desc: "Cryptographic message signing proves wallet ownership. Your keys never touch our servers." },
  { icon: "🛡️", title: "Capital Preservation", desc: "Configurable stop-loss floors, auto out-of-range pausing, and hard 10x leverage cap protect your funds." },
  { icon: "📈", title: "Live Dashboard", desc: "Real-time grid chart, PnL tracking, order book, epoch progress, vault stats — all in one interface." },
];

const STEPS = [
  { n: "01", title: "Connect and Sign", desc: "Link MetaMask or Rabby. Sign a one-time message to prove wallet ownership — no gas, no funds moved." },
  { n: "02", title: "Configure Strategy", desc: "Pick Grid or Watch trading. Set your volume target, price range, leverage, gas mode, and stop-loss." },
  { n: "03", title: "Run and Earn", desc: "Hit Start. The bot places limit orders, detects fills, replaces them, and logs every cycle." },
];

const VOLUME_TIERS = [
  { label: "$3K",   desc: "Starter" },
  { label: "$10K",  desc: "Basic" },
  { label: "$50K",  desc: "Mid" },
  { label: "$100K", desc: "Advanced" },
  { label: "$250K", desc: "Pro" },
  { label: "$500K", desc: "Elite" },
  { label: "$1M",   desc: "Whale" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="w-full bg-navy overflow-hidden py-2 border-b border-navy-dark">
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="font-mono text-xs text-white/80 mx-8">{item}</span>
            ))}
          </div>
        </div>
      </div>

      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(var(--navy) 1px, transparent 1px), linear-gradient(90deg, var(--navy) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-navy/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-navy/8 border border-navy/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            <span className="font-mono text-xs text-navy font-medium uppercase tracking-widest">Live on Dango Mainnet</span>
          </div>
          <h1 className="font-display font-black text-charcoal mb-6" style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)", lineHeight: "0.95", letterSpacing: "-0.02em" }}>
            AUTOMATE YOUR
            <br />
            <span className="text-navy">DANGO TRADING</span>
            <br />
            WITH GRIDASHI
          </h1>
          <p className="font-mono text-sm text-[#6B6860] max-w-xl mx-auto leading-relaxed mb-6">
            Grid or Watch trading. $3K to $1M weekly volume targets. All limit orders — lowest fees on Dango. Earn DNG airdrop points every epoch.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {VOLUME_TIERS.map((t) => (
              <span key={t.label} className="font-mono text-xs text-navy bg-navy/8 border border-navy/20 px-3 py-1 rounded-full">
                {t.label} <span className="text-[#6B6860]">· {t.desc}</span>
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard" className="btn-primary text-base px-8 py-3">Launch App</Link>
            <a href="https://docs.dango.exchange" target="_blank" rel="noopener noreferrer" className="btn-secondary text-base px-8 py-3">Read Docs</a>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-px bg-[#D8D4CC] rounded-lg overflow-hidden border border-[#D8D4CC]">
            {[
              { label: "Strategies", value: "Grid + Watch" },
              { label: "Order Type", value: "Limit Only" },
              { label: "DNG to Community", value: "50%" },
            ].map((s) => (
              <div key={s.label} className="bg-card px-6 py-5 text-center">
                <p className="font-mono font-semibold text-navy text-xl mb-1">{s.value}</p>
                <p className="label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="px-6 py-24 bg-card border-y border-[#D8D4CC]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="label mb-3">What it does</p>
            <h2 className="font-display font-semibold text-charcoal" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.01em" }}>
              Everything you need to farm
              <br />
              <span className="text-navy">Dango like a pro</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group">
                <div className="text-2xl mb-4">{f.icon}</div>
                <h3 className="font-display font-semibold text-charcoal text-lg mb-2 group-hover:text-navy transition-colors">{f.title}</h3>
                <p className="font-mono text-xs text-[#6B6860] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="label mb-3">Volume targets</p>
            <h2 className="font-display font-semibold text-charcoal" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.01em" }}>
              From casual to whale —
              <br />
              <span className="text-navy">pick your weekly target</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {VOLUME_TIERS.map((t, i) => (
              <div key={t.label} className="card p-5 text-center hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
                <p className="font-display font-semibold text-navy text-2xl mb-1">{t.label}</p>
                <p className="label">{t.desc}</p>
                {i === 0 && <span className="mt-2 inline-block font-mono text-xs text-green bg-green/10 px-2 py-0.5 rounded-full">Default</span>}
                {i === 6 && <span className="mt-2 inline-block font-mono text-xs text-navy bg-navy/10 px-2 py-0.5 rounded-full">Max</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-6 py-24 bg-card border-y border-[#D8D4CC]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="label mb-3">Three steps</p>
            <h2 className="font-display font-semibold text-charcoal" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.01em" }}>
              From wallet to <span className="text-navy">running bot</span>
              <br />
              in minutes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="card p-6">
                <div className="font-display font-black text-navy/20 text-5xl mb-4 leading-none">{s.n}</div>
                <h3 className="font-display font-semibold text-charcoal text-xl mb-2">{s.title}</h3>
                <p className="font-mono text-xs text-[#6B6860] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="stats" className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <p className="label mb-3">Fee advantage</p>
                <h2 className="font-display font-semibold text-charcoal mb-4" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", letterSpacing: "-0.01em" }}>
                  We always use
                  <br />
                  <span className="text-navy">limit orders</span>
                </h2>
                <p className="font-mono text-xs text-[#6B6860] leading-relaxed mb-4">
                  Most bots use market orders for speed. Market orders are taker orders and pay a premium.
                  This bot places every order as a limit order, qualifying as maker and paying the lowest fee tier on Dango.
                </p>
                <p className="font-mono text-xs text-green leading-relaxed">
                  Lower fees = more capital stays in your account = more volume per dollar.
                </p>
              </div>
              <div className="flex-shrink-0 w-full md:w-64">
                <div className="grid gap-3">
                  <div className="p-4 rounded-lg border-2 border-crimson/30 bg-crimson/5">
                    <p className="font-mono text-xs text-[#6B6860] mb-1">Market order (taker)</p>
                    <p className="font-display font-semibold text-2xl text-crimson">~0.05%</p>
                  </div>
                  <div className="p-4 rounded-lg border-2 border-green/30 bg-green/5">
                    <p className="font-mono text-xs text-[#6B6860] mb-1">Limit order (maker)</p>
                    <p className="font-display font-semibold text-2xl text-green">~0.02%</p>
                    <p className="font-mono text-xs text-green mt-1">This bot</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-card border-t border-[#D8D4CC]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-black text-charcoal mb-6" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em", lineHeight: "0.95" }}>
            READY TO START
            <br />
            <span className="text-navy">FARMING?</span>
          </h2>
          <p className="font-mono text-sm text-[#6B6860] mb-8 max-w-md mx-auto leading-relaxed">
            Connect your wallet, sign once to verify ownership, configure your strategy, and let the bot run.
            Your DNG airdrop allocation counts every volume epoch.
          </p>
          <Link href="/dashboard" className="btn-primary text-base px-10 py-3.5">
            Launch App — It is Free
          </Link>
          <p className="font-mono text-xs text-[#6B6860] mt-4">
            Non-custodial · Limit orders only · No gas for signing
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}