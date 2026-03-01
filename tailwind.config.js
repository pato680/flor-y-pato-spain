/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#FAF8F5',
        surface: '#FFFFFF',
        accent: '#C8472A',
        'accent-light': '#FDF0EC',
        gold: '#E8A04A',
        text: '#1C1917',
        'text-sub': '#78716C',
        border: '#E7E2DC',
        inactive: '#A09890',
        // F1
        'f1-red': '#E10600',
        'f1-dark': '#0F0F0F',
        'f1-gray': '#1C1C1C',
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
        input: '12px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(28,25,23,0.06)',
        'card-hover': '0 4px 20px rgba(28,25,23,0.10)',
        'elevated': '0 2px 8px rgba(28,25,23,0.05), 0 8px 32px rgba(28,25,23,0.09)',
      },
      fontSize: {
        'screen-title': ['22px', { fontWeight: '700', lineHeight: '1.2' }],
        'card-title': ['16px', { fontWeight: '600', lineHeight: '1.3' }],
        body: ['14px', { fontWeight: '400', lineHeight: '1.5' }],
        label: ['12px', { fontWeight: '500', letterSpacing: '0.5px', lineHeight: '1.4' }],
        hero: ['48px', { fontWeight: '800', lineHeight: '1.1' }],
      },
      keyframes: {
        'page-enter': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'card-enter': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'modal-enter': {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'overlay-enter': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'rev-up': {
          '0%': { opacity: '0', transform: 'scale(0.6) translateY(8px)' },
          '60%': { transform: 'scale(1.06) translateY(-2px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'speed-sweep': {
          '0%': { transform: 'translateX(-110%)', opacity: '0' },
          '30%': { opacity: '1' },
          '100%': { transform: 'translateX(110%)', opacity: '0' },
        },
        'race-stripe': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 0' },
        },
        'sector-in': {
          '0%': { opacity: '0', transform: 'translateX(-6px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'flag-drop': {
          '0%': { opacity: '0', transform: 'translateY(-8px) rotate(-4deg)' },
          '60%': { transform: 'translateY(2px) rotate(1deg)' },
          '100%': { opacity: '1', transform: 'translateY(0) rotate(0deg)' },
        },
        'stripe-shimmer': {
          '0%, 25%': { transform: 'translateX(-120%)', opacity: '0' },
          '40%': { opacity: '1' },
          '75%, 100%': { transform: 'translateX(400%)', opacity: '0' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.75)' },
        },
        'badge-glow': {
          '0%, 100%': { boxShadow: '0 0 0px rgba(200,71,42,0)' },
          '50%': { boxShadow: '0 0 8px rgba(200,71,42,0.55), 0 0 18px rgba(200,71,42,0.2)' },
        },
        'fab-enter': {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'flag-wave': {
          '0%, 100%': { transform: 'rotate(-7deg)' },
          '50%':       { transform: 'rotate(7deg)' },
        },
        'tire-spin': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'page-enter': 'page-enter 300ms cubic-bezier(0.32,0.72,0,1) both',
        'card-enter': 'card-enter 300ms cubic-bezier(0.32,0.72,0,1) both',
        'modal-enter': 'modal-enter 320ms cubic-bezier(0.32,0.72,0,1) both',
        'overlay-enter': 'overlay-enter 200ms ease both',
        'count-up': 'count-up 400ms cubic-bezier(0.32,0.72,0,1) both',
        'rev-up': 'rev-up 500ms cubic-bezier(0.32,0.72,0,1) both',
        'speed-sweep': 'speed-sweep 900ms cubic-bezier(0.4,0,0.2,1) both',
        'race-stripe': 'race-stripe 1.2s linear infinite',
        'sector-in': 'sector-in 300ms cubic-bezier(0.32,0.72,0,1) both',
        'flag-drop': 'flag-drop 500ms cubic-bezier(0.32,0.72,0,1) both',
        'stripe-shimmer': 'stripe-shimmer 3.5s ease-in-out 0.8s infinite',
        'pulse-dot': 'pulse-dot 1.8s ease-in-out infinite',
        'badge-glow': 'badge-glow 2.2s ease-in-out 1s infinite',
        'fab-enter': 'fab-enter 250ms cubic-bezier(0.32,0.72,0,1) both',
        'flag-wave':  'flag-wave 1.4s ease-in-out infinite',
        'tire-spin':  'tire-spin 14s linear infinite',
      },
      transitionTimingFunction: {
        ios: 'cubic-bezier(0.32,0.72,0,1)',
      },
      spacing: {
        nav: '72px',
        header: '56px',
      },
    },
  },
  plugins: [],
}
