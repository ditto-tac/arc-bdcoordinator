/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rc: {
          red: '#CC0000',
          redDark: '#A50000',
          ink: '#1A1A1A',
          slate: '#4A5568',
          mist: '#F7FAFC',
          stone: '#E2E8F0',
          teal: '#0891B2',
          amber: '#D97706',
          emerald: '#059669',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
