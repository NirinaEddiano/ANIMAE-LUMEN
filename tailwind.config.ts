import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        sand: "#F5F5F0",
        sage: "#8A9A86",
        clay: "#8B7355",
        stone: "#A8A29E",
        charcoal: "#1A1A1A",
        parchment: "#EDE9DF",
        dust: "#D4CFC4",
        nature: {
          50: "#FAFAF6",
          100: "#F5F5EE",
          200: "#E6E3D9",
          300: "#D4CFC4",
          400: "#A8A29E",
          500: "#7A756F",
          600: "#5C5853",
          700: "#3D3A37",
          800: "#2A2826",
          900: "#1A1A1A",
        },
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        "paper-texture": "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23paper)' opacity='0.03'/%3E%3C/svg%3E\")",
        "sand-texture": "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='sand'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='60' height='60' filter='url(%23sand)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        organic: "0 4px 24px rgba(139, 115, 85, 0.08)",
        "organic-lg": "0 8px 40px rgba(139, 115, 85, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
