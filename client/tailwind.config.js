/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'base-100': 'var(--b1)',
        'base-200': 'var(--b2)',
        'base-300': 'var(--b3)',
        'base-content': 'var(--bc)',
        'primary': 'var(--p)',
        'primary-content': 'var(--pc)',
        'secondary': 'var(--s)',
        'secondary-content': 'var(--sc)',
        'accent': 'var(--a)',
        'accent-content': 'var(--ac)',
        'neutral': 'var(--n)',
        'neutral-content': 'var(--nc)',
        'info': 'var(--in)',
        'info-content': 'var(--inc)',
        'success': 'var(--su)',
        'success-content': 'var(--suc)',
        'warning': 'var(--wa)',
        'warning-content': 'var(--wac)',
        'error': 'var(--er)',
        'error-content': 'var(--erc)',
      },
    },
  },
  plugins: [
    daisyui
  ],
  daisyui: {
    themes: ["light", "dark"],
  },
  darkMode: 'class',
}