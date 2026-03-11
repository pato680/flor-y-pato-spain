/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Azeret Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        bg: '#F5F5F3',
        'bg-sub': '#EAEAE6',
        surface: '#FFFFFF',
        accent: '#E10600',
        'accent-soft': '#FFE8E6',
        text: '#0F0F0F',
        'text-sub': '#5A5A56',
        'text-muted': '#9A9A94',
        border: '#DDDDD8',
        'ev-green': '#00965E',
        'ev-blue': '#0070C8',
        'ev-amber': '#F09000',
        'ev-violet': '#7838C8',
      },
      borderRadius: {
        card: '8px',
        btn: '6px',
        input: '6px',
      },
      boxShadow: {
        card: 'none',
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
        'fab-enter': {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%,20%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '.5' },
          '80%,100%': { transform: 'translateX(300%)', opacity: '0' },
        },
        'carbon-breathe': {
          '0%,100%': { opacity: '0.03' },
          '50%': { opacity: '0.05' },
        },
        'dot-pop': {
          '0%': { transform: 'scale(0)' },
          '60%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        'line-grow': {
          from: { transform: 'scaleY(0)' },
          to: { transform: 'scaleY(1)' },
        },
        'lights-glow': {
          '0%,100%': { boxShadow: '0 0 3px var(--tw-shadow-color)' },
          '50%': { boxShadow: '0 0 10px var(--tw-shadow-color), 0 0 20px var(--tw-shadow-color)' },
        },
      },
      animation: {
        'page-enter': 'page-enter 300ms cubic-bezier(0.32,0.72,0,1) both',
        'card-enter': 'card-enter 300ms cubic-bezier(0.32,0.72,0,1) both',
        'modal-enter': 'modal-enter 320ms cubic-bezier(0.32,0.72,0,1) both',
        'overlay-enter': 'overlay-enter 200ms ease both',
        'count-up': 'count-up 400ms cubic-bezier(0.32,0.72,0,1) both',
        'fab-enter': 'fab-enter 250ms cubic-bezier(0.32,0.72,0,1) both',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'carbon-breathe': 'carbon-breathe 4s ease-in-out infinite',
        'dot-pop': 'dot-pop 350ms cubic-bezier(0.32,0.72,0,1) both',
        'line-grow': 'line-grow 400ms cubic-bezier(0.32,0.72,0,1) both',
        'lights-glow': 'lights-glow 2s ease-in-out infinite',
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
