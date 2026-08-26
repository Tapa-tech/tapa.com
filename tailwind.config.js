/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '900px',
      'lg': '1280px',
    },
    extend: {
      colors: {
        bg: 'var(--bg)',
        card: 'var(--card)',
        dark: 'var(--dark)',
        pink: 'var(--pink)',
        amber: 'var(--amber)',
        gold: 'var(--gold)',
      },
    },
  },
  plugins: [],
}
