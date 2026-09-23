/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        finos: {
          bg: '#0a0d14',
          panel: '#111622',
          surface: '#182030',
          border: '#232d42',
          primary: '#3b82f6',
          cyan: '#06b6d4',
          positive: '#10b981',
          negative: '#ef4444',
          warning: '#f59e0b',
          muted: '#64748b',
          text: '#f8fafc',
          textMuted: '#94a3b8'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}
