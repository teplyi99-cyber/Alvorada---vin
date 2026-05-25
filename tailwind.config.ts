import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sky: {
          50: '#F0F7FF', 100: '#E1EFFF', 200: '#C3DFFF',
          400: '#87BFFF', 500: '#4CA3E8', 600: '#3A8FD1', 700: '#2875B5',
        },
        forest: {
          50: '#F0FDF8', 100: '#E0FDF2', 200: '#C1FAE4',
          500: '#3DBE8A', 600: '#2FA076', 700: '#218562',
        },
        sand: {
          500: '#E8B86D', 600: '#D4985D',
        },
        rose: {
          50: '#FFF5F7', 400: '#E8939C', 500: '#E07878', 600: '#C85C66',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
