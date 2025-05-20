/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2f476a',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#27486D',
          700: '#1e2a3b',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        },
        secondary: {
          DEFAULT: '#FFA054',
          50: '#fff8f1',
          100: '#feecdc',
          200: '#fcd9b9',
          300: '#FFA054',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407'
        },
        'primary-faded': '#eff6fe',
        'secondary-faded': '#fdf3ed',
        'white-ish': '#fbfbfb',
        'black-ish': '#081424'
      },
      fontFamily: {
        coolvetica: ['Coolvetica', 'sans-serif'],
        helvetica: ['Helvetica Neue', 'sans-serif']
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}