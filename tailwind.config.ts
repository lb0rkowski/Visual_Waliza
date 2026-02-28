import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cs: {
          bg: "#080C12",
          deep: "#050810",
          card: "#0E1319",
          panel: "#1A2030",
          line: "#1A1F2B",
          gold: "#C49767",
          "gold-light": "#D4A87A",
          "gold-dim": "#90714F",
          "gold-muted": "#6B5A42",
          bronze: "#AC865C",
          text: "#D8D0C6",
          muted: "#706860",
          dim: "#403830",
          white: "#F0EBE5",
          red: "#8B3030",
          green: "#3B6B3B",
        },
      },
      fontFamily: {
        display: ["Oswald", "sans-serif"],
        mono: ["Space Mono", "monospace"],
        body: ["DM Sans", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "pulse-slow": "pulseSlow 4s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        "wave-bar": "waveBar 1s ease-in-out infinite alternate",
        "border-glow": "borderGlow 3s ease infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        waveBar: {
          "0%, 100%": { transform: "scaleY(0.2)" },
          "50%": { transform: "scaleY(1)" },
        },
        borderGlow: {
          "0%, 100%": { borderColor: "#1A1F2B" },
          "50%": { borderColor: "#90714F30" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
