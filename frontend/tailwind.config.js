/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary palette - electric cyan
        primary: {
          50:  '#e0fffe',
          100: '#b3fffe',
          200: '#80fffd',
          300: '#4dfffc',
          400: '#26fffe',
          500: '#00e5ff',
          600: '#00b3cc',
          700: '#008099',
          800: '#004d66',
          900: '#001a33',
        },
        // Surface colors - deep dark
        surface: {
          900: '#020409',
          800: '#070d16',
          700: '#0d1524',
          600: '#111c2e',
          500: '#162438',
          400: '#1d2f47',
          300: '#263a57',
          200: '#304868',
        },
        // Accent colors
        accent: {
          green:  '#00ff88',
          yellow: '#ffd700',
          orange: '#ff8c42',
          red:    '#ff4757',
          purple: '#a855f7',
          pink:   '#ec4899',
        },
        // Algorithm category colors
        algo: {
          sorting:  '#00e5ff',
          searching:'#00ff88',
          graph:    '#a855f7',
          tree:     '#ffd700',
          list:     '#ff8c42',
          stack:    '#ec4899',
          dp:       '#ff4757',
          string:   '#38bdf8',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Exo 2"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':        'float 6s ease-in-out infinite',
        'glow':         'glow 2s ease-in-out infinite alternate',
        'scan':         'scan 2s linear infinite',
        'matrix':       'matrix 20s linear infinite',
        'slide-up':     'slideUp 0.5s ease-out',
        'slide-in':     'slideIn 0.3s ease-out',
        'fade-in':      'fadeIn 0.4s ease-out',
        'shimmer':      'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        glow: {
          from: { boxShadow: '0 0 10px #00e5ff40, 0 0 20px #00e5ff20' },
          to:   { boxShadow: '0 0 20px #00e5ff80, 0 0 40px #00e5ff40' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: 0, transform: 'translateX(-20px)' },
          to:   { opacity: 1, transform: 'translateX(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
      backgroundImage: {
        'grid-pattern':    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300e5ff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'dot-pattern':     "radial-gradient(circle, #00e5ff08 1px, transparent 1px)",
        'hero-gradient':   'linear-gradient(135deg, #020409 0%, #070d16 40%, #0d1524 100%)',
        'card-gradient':   'linear-gradient(135deg, #0d1524 0%, #111c2e 100%)',
        'glow-gradient':   'radial-gradient(ellipse at center, #00e5ff15 0%, transparent 70%)',
        'shimmer-gradient':'linear-gradient(90deg, transparent, #00e5ff20, transparent)',
      },
      boxShadow: {
        'glow-sm':  '0 0 10px #00e5ff40',
        'glow':     '0 0 20px #00e5ff40, 0 0 40px #00e5ff20',
        'glow-lg':  '0 0 40px #00e5ff60, 0 0 80px #00e5ff30',
        'card':     '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover':'0 8px 40px rgba(0,0,0,0.6)',
        'inner-glow':'inset 0 0 20px #00e5ff10',
      },
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.5rem',
      },
    },
  },
  plugins: [],
}
