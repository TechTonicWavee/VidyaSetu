/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    { pattern: /bg-(gray|blue|teal|purple|amber|rose|green|slate|indigo|violet)-(50|100|500|600|700)/ },
    { pattern: /text-(gray|blue|teal|purple|amber|rose|green|slate|indigo|violet)-(500|600|700)/ },
    { pattern: /border-(gray|blue|teal|purple|amber|rose|green|slate|indigo|violet)-(100|200|500)/ },
  ],
  theme: {
    extend: {
      colors: {
        // ── Legacy named colors (kept so existing screens are unchanged) ──
        primary: "#1A56DB",
        "primary-dark": "#1447C0",
        navy: "#0D1B2A",
        teal: "#0F766E",
        purple: "#5B21B6",
        amber: "#D97706",
        "bg-base": "#F3F4F6",

        // ── Semantic, token-driven colors (theme-correct in light + dark) ──
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",
        content: "var(--content)",
        "content-2": "var(--content-2)",
        muted: "var(--muted)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        brand: {
          DEFAULT: "var(--brand)",
          600: "var(--brand-600)",
          700: "var(--brand-700)",
          soft: "var(--brand-soft)",
          fg: "var(--brand-fg)",
          accent: "var(--brand-accent)",
        },
        success: { DEFAULT: "var(--success)", soft: "var(--success-soft)" },
        warning: { DEFAULT: "var(--warning)", soft: "var(--warning-soft)" },
        danger: { DEFAULT: "var(--danger)", soft: "var(--danger-soft)" },
        info: { DEFAULT: "var(--info)", soft: "var(--info-soft)" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-newsreader)", "ui-serif", "Georgia"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "SFMono-Regular"],
      },
      boxShadow: {
        card: "var(--shadow-sm)",
        "card-hover": "var(--shadow-md)",
      },
      borderRadius: {
        xl2: "1rem",
      },
      backgroundImage: {
        "brand-gradient": "var(--brand-gradient)",
      },
    },
  },
  plugins: [],
};
