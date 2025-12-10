// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom font sizes for Modern SaaS aesthetic (US5)
      fontSize: {
        '7xl': '5rem', // 80px
        '8xl': '6rem', // 96px
      },
      // Custom colors or extended palette (optional, using indigo-600 as primary)
      colors: {
        indigo: {
          50: '#f9f9ff',
          100: '#f0f0ff',
          200: '#e0e0ff',
          // Use existing shades for primary CTAs
        }
      },
      // Custom animations for subtle effects (FR-009 / US5)
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // Background gradient for hero section (optional design touch)
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to right, #ffffff, #f9f9ff)',
      },
    },
  },
  plugins: [],
}