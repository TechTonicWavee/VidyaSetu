/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A56DB",
        "primary-dark": "#1447C0",
        navy: "#0D1B2A",
        teal: "#0F766E",
        purple: "#5B21B6",
        amber: "#D97706",
        "bg-base": "#F3F4F6",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
