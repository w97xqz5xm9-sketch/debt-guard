/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        black: '#000000',
        white: '#FFFFFF',
        // Iridescent gradient colors (Öl-/Irideszenz-Effekt) - Intensiviert
        iridescent: {
          violet: '#A78BFA',
          blue: '#60A5FA',
          green: '#34D399',
          yellow: '#FBBF24',
        },
        // Grayscale for dark theme
        gray: {
          50: '#1A1A1A',
          100: '#2A2A2A',
          200: '#3A3A3A',
          300: '#4A4A4A',
          400: '#5A5A5A',
          500: '#6A6A6A',
          600: '#7A7A7A',
          700: '#8A8A8A',
          800: '#9A9A9A',
          900: '#FFFFFF',
        },
        // Semantic colors (minimal, for warnings/errors only) - Intensiviert
        danger: {
          DEFAULT: '#FF4444',
          light: '#991F1F',
        },
        success: {
          DEFAULT: '#22D3A6',
          light: '#065F46',
        },
        warning: {
          DEFAULT: '#FCD34D',
          light: '#92400E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'Neue Haas Grotesk', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'wide': '0.05em',
        'wider': '0.1em',
        'widest': '0.15em',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(167, 139, 250, 0.6), 0 0 20px rgba(96, 165, 250, 0.4)' },
          '100%': { boxShadow: '0 0 30px rgba(167, 139, 250, 0.9), 0 0 50px rgba(96, 165, 250, 0.7), 0 0 70px rgba(52, 211, 153, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}

