/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - 和風高級
        "primary-dark-green": "#1B3B2F",
        "primary-navy": "#1A2734",
        "primary-sakura": "#EAD5DC",
        "primary-gold": "#CBB682",

        // Background colors
        "bg-cream": "#FEFDF8",
        "bg-white": "#FFFFFF",
        cream: "#FEFDF8",

        // Text colors
        "text-charcoal": "#2C2C2C",
        "text-dark": "#1A1A1A",
        "text-gray": "#6B7280",
        charcoal: "#2C2C2C",

        // Border and subtle colors
        "border-light": "#E5E7EB",
        "border-sakura": "#F3E8ED",
        "soft-green": "#F0F4F1",
        "soft-gold": "#F7F5F0",

        // Legacy colors for gradual migration
        "primary-purple": "#1B3B2F", // Map to dark green
        "primary-white": "#FEFEFE",
        "preserved-rose": "#EAD5DC", // Map to sakura
        "preserved-blue": "#1A2734", // Map to navy
        "preserved-green": "#1B3B2F", // Map to dark green
        "accent-purple": "#1B3B2F",
        "accent-gold": "#CBB682",
        "soft-pink": "#EAD5DC",
        "sage-green": "#1B3B2F",
      },
      fontFamily: {
        serif: [
          "Noto Serif JP",
          "游明朝",
          "Yu Mincho",
          "Hiragino Mincho ProN",
          "serif",
        ],
        japanese: [
          "Noto Serif JP",
          "游明朝",
          "Yu Mincho",
          "Hiragino Mincho ProN",
          "serif",
        ],
        sans: [
          "Noto Sans JP",
          "Hiragino Sans",
          "Yu Gothic",
          "Meiryo",
          "sans-serif",
        ],
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "bounce-gentle": "bounceGentle 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
