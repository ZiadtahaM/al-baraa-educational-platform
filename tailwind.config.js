/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E7D32',
          dark: '#1B5E20',
          light: '#4CAF50',
        },
        secondary: {
          DEFAULT: '#C9A227',
          dark: '#9A7B1F',
          light: '#E6C65C',
        },
        surface: '#FFFFFF',
        background: '#FAFAFA',
        error: '#D32F2F',
        success: '#388E3C',
        warning: '#F9A825',
      },
      fontFamily: {
        arabic: ['Noto Sans Arabic', 'Cairo', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'elevated': '0 4px 16px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}