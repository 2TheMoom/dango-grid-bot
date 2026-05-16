import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#E9E6DF",
        card: "#F0EDE7",
        navy: "#1F3A8F",
        charcoal: "#161719",
        green: "#1A6B3C",
        crimson: "#B01C2E",
        "navy-light": "#2D4EAF",
        "navy-dark": "#152A6E",
        "green-light": "#22894E",
        "crimson-light": "#D4233A",
        "border-subtle": "#D8D4CC",
        "text-muted": "#6B6860",
      },
      fontFamily: {
        display: ["Barlow Condensed", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-2xl": ["5rem", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-xl": ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "600" }],
        "display-md": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }],
        "display-sm": ["1.875rem", { lineHeight: "1.2", fontWeight: "600" }],
      },
      boxShadow: {
        card: "0 1px 3px rgba(22,23,25,0.06), 0 1px 2px rgba(22,23,25,0.04)",
        "card-hover": "0 4px 12px rgba(22,23,25,0.1), 0 2px 4px rgba(22,23,25,0.06)",
        navy: "0 4px 24px rgba(31,58,143,0.2)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ticker": "ticker 30s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        ticker: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
