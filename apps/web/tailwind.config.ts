import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        surface: "hsl(var(--surface))",
        elevated: "hsl(var(--elevated))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        line: "hsl(var(--line))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        aura: {
          DEFAULT: "hsl(var(--aura))",
          foreground: "hsl(var(--aura-foreground))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        ink: "hsl(var(--foreground))",
        paper: "hsl(var(--background))",
      },
      fontFamily: {
        sans: ["Archivo Variable", "Archivo", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "0.625rem",
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.04em" }],
        "7xl": ["4.5rem", { lineHeight: "0.95", letterSpacing: "-0.045em" }],
        "8xl": ["6rem", { lineHeight: "0.9", letterSpacing: "-0.05em" }],
      },
      maxWidth: {
        shell: "76rem",
        prose: "68ch",
      },
      boxShadow: {
        lift: "0 18px 40px -24px hsl(var(--foreground) / 0.35)",
        panel: "0 1px 0 0 hsl(var(--line)), 0 24px 60px -48px hsl(var(--foreground) / 0.5)",
        /* Bisel del sistema de botones: brillo superior, caída inferior y sombra proyectada. */
        bevel: "inset 0 1px 0 0 var(--btn-rim), inset 0 -2px 4px var(--btn-low), 0 1px 0 0 hsl(var(--background)), 0 10px 18px -14px hsl(var(--foreground) / 0.6)",
        bevelLift: "inset 0 1px 0 0 var(--btn-rim), inset 0 -3px 5px var(--btn-low), 0 1px 0 0 hsl(var(--background)), 0 14px 26px -12px hsl(var(--foreground) / 0.45)",
      },
      keyframes: {
        "draw-line": {
          from: { strokeDashoffset: "1200" },
          to: { strokeDashoffset: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "draw-line": "draw-line 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "pop-in": "pop-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) both",
        marquee: "marquee 38s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
