
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#1a6fb9", // Keep the original primary color
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        wave: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        wave: "wave 15s linear infinite",
        "fade-in": "fade-in 0.5s ease-out",
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'hsl(var(--foreground))',
            h1: { color: 'hsl(var(--foreground))' },
            h2: { color: 'hsl(var(--foreground))' },
            h3: { color: 'hsl(var(--foreground))' },
            h4: { color: 'hsl(var(--foreground))' },
            p: { color: 'hsl(var(--foreground))' },
            strong: { color: 'hsl(var(--foreground))' },
            a: { color: '#9b87f5' },
          },
        },
        dark: {
          css: {
            color: 'white',
            h1: { color: 'white' },
            h2: { color: 'white' },
            h3: { color: 'white' },
            h4: { color: 'white' },
            p: { color: 'white' },
            strong: { color: 'white' },
            a: { color: '#9b87f5' },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
