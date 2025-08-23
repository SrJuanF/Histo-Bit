import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "histo-primary": "#10231c",
        "histo-secondary": "#214a3c",
        "histo-tertiary": "#17352b",
        "histo-accent": "#019863",
        "histo-accent-hover": "#017a4f",
        "histo-text-primary": "#ffffff",
        "histo-text-secondary": "#8ecdb7",
        "histo-border-primary": "#2f6a55",
        "histo-border-secondary": "#214a3c",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        "noto-sans": ["Noto Sans", "sans-serif"],
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "theme-change": "themeChange 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};
export default config;
