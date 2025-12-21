/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors - Apple-inspired
        black: '#000000',
        white: '#FFFFFF',
        // Accent colors - Stripe-inspired, subtle but precise
        accent: {
          blue: '#635BFF',      // Stripe primary
          indigo: '#7C3AED',    // Premium purple
          cyan: '#06B6D4',      // Modern cyan
          emerald: '#10B981',   // Success green
        },
        // Grayscale - Apple-inspired with more nuance
        gray: {
          50: '#0A0A0A',        // Deepest black
          100: '#1C1C1E',       // iOS dark background
          200: '#2C2C2E',       // Card background
          300: '#3A3A3C',       // Borders
          400: '#48484A',       // Secondary text
          500: '#636366',       // Tertiary text
          600: '#8E8E93',       // Placeholder
          700: '#AEAEB2',       // Disabled
          800: '#C7C7CC',       // Light text on dark
          900: '#F2F2F7',       // Almost white
        },
        // Semantic colors - Precise, minimal
        danger: {
          DEFAULT: '#FF3B30',   // iOS red
          light: '#FF453A',
        },
        success: {
          DEFAULT: '#30D158',   // iOS green
          light: '#34C759',
        },
        warning: {
          DEFAULT: '#FF9F0A',   // iOS orange
          light: '#FF9500',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'SF Pro Display', 'SF Pro Text', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'tight': '-0.01em',
        'normal': '0em',
        'wide': '0.02em',
        'wider': '0.04em',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.2)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)',
        'large': '0 8px 32px rgba(0, 0, 0, 0.6), 0 4px 8px rgba(0, 0, 0, 0.4)',
        'accent': '0 0 0 1px rgba(99, 91, 255, 0.1), 0 4px 16px rgba(99, 91, 255, 0.15)',
      },
    },
  },
  plugins: [],
}

