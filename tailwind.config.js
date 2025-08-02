/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary colors for Buddhist flowers
        'primary-purple': '#6B46C1',
        'primary-gold': '#D4AF37',
        'primary-white': '#FEFEFE',
        
        // Preserved flower colors
        'preserved-rose': '#E91E63',
        'preserved-blue': '#2196F3',
        'preserved-green': '#4CAF50',
        
        // Neutral colors
        'bg-cream': '#FFF8E7',
        'cream': '#FFF8E7',
        'text-charcoal': '#2C2C2C',
        'charcoal': '#2C2C2C',
        'border-light': '#E5E5E5',
        
        // Additional UI colors
        'accent-purple': '#9333EA',
        'accent-gold': '#F59E0B',
        'soft-pink': '#F8BBD9',
        'sage-green': '#9CA3AF',
      },
      fontFamily: {
        'japanese': ['Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};