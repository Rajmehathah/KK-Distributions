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
        brand: {
          orange: {
            50: '#FFF3E0',
            100: '#FFE0B2',
            200: '#FFCC80',
            300: '#FFB74D',
            400: '#FFA726',
            500: '#FF9800',
            600: '#FB8C00',
            700: '#F57C00',
            800: '#EF6C00',
            900: '#E65100', // Deep Orange
          },
          gold: {
            50: '#FFFDE7',
            100: '#FFF9C4',
            200: '#FFF59D',
            300: '#FFF176',
            400: '#FFEE58',
            500: '#FFEB3B',
            600: '#FDD835',
            700: '#FBC02D',
            800: '#F9A825',
            900: '#FFB300', // Warm Gold
          },
          sandalwood: {
            50: '#F7F2ED',
            100: '#EFE5DC',
            200: '#DFCCBC',
            300: '#CEB29B',
            400: '#BD997B',
            500: '#A37754',
            600: '#846044',
            700: '#664B34',
            800: '#4D3827',
            900: '#33251A', // Rich Sandalwood
          },
          cream: {
            50: '#FAF8F5',
            100: '#FCF9F2', // Premium Cream
            200: '#F5EFE0',
            300: '#EBE2CD',
            400: '#DECFA9',
          },
          charcoal: {
            50: '#F6F6F6',
            100: '#E7E7E7',
            800: '#1A1A1A',
            900: '#121212', // Dark Charcoal
            950: '#0C0C0C',
          }
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        satoshi: ['Satoshi', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'float-medium': 'float-medium 4s ease-in-out infinite',
        'float-fast': 'float-fast 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-medium': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'float-fast': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)', filter: 'drop-shadow(0 0 5px rgba(230, 81, 0, 0.2))' },
          '50%': { opacity: '1', transform: 'scale(1.02)', filter: 'drop-shadow(0 0 15px rgba(230, 81, 0, 0.4))' },
        }
      }
    },
  },
  plugins: [],
}
