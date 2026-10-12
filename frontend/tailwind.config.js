/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Deep teal (#123C38)
        brand: {
          50: '#F0FDF9',
          100: '#D1FAE5', // Soft mint (#D1FAE5)
          200: '#A7F3D0',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#1B544E',
          600: '#123C38', // Primary Deep teal (#123C38)
          700: '#0E2F2C', // Deep teal hover
          800: '#0A2220',
          900: '#071816',
          950: '#030E0D',
        },
        // Accent: Emerald green (#10B981) & Secondary accent: Soft mint (#D1FAE5)
        purpleBrand: {
          50: '#ECFDF5',
          100: '#D1FAE5', // Soft mint (#D1FAE5)
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981', // Accent Emerald green (#10B981)
          600: '#10B981', // Accent Emerald green (#10B981)
          700: '#059669', // Emerald green hover
          800: '#047857',
          900: '#065F46',
        },
        // Slate palette: Off-white page bg (#F5F7F6), Light gray borders (#E5E7EB),
        // Slate gray secondary text (#64748B), Charcoal primary text (#1F2937)
        slate: {
          50: '#F5F7F6',  // Page background: Off-white (#F5F7F6)
          100: '#EFF2F1',
          200: '#E5E7EB', // Borders: Light gray (#E5E7EB)
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B', // Secondary text: Slate gray (#64748B)
          600: '#64748B', // Secondary text: Slate gray (#64748B)
          700: '#374151',
          800: '#1F2937', // Primary text: Charcoal (#1F2937)
          900: '#1F2937', // Primary text: Charcoal (#1F2937)
          950: '#111827',
        },
        // Success status: Green (#15803D), Accent: Emerald green (#10B981)
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5', // Soft mint (#D1FAE5)
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981', // Accent Emerald green (#10B981)
          600: '#10B981', // Accent Emerald green (#10B981)
          700: '#15803D', // Success status: Green (#15803D)
          800: '#166534',
          900: '#14532D',
        },
        // Teal scale matching primary Deep teal (#123C38)
        teal: {
          50: '#F0FDF9',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#144641',
          600: '#123C38', // Deep teal (#123C38)
          700: '#0E2F2C',
          800: '#0A2220',
          900: '#071816',
        },
        // Spam / error status: Red (#DC2626)
        rose: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626', // Spam/error status: Red (#DC2626)
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        red: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626', // Red (#DC2626)
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        }
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(18, 60, 56, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'glow-teal': '0 0 25px -5px rgba(18, 60, 56, 0.25)',
        'glow-indigo': '0 0 25px -5px rgba(18, 60, 56, 0.25)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-rose': '0 0 25px -5px rgba(220, 38, 38, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        }
      }
    },
  },
  plugins: [],
}
