/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%': { 
            transform: 'translateY(0) translateX(0) rotate(0deg) scale(1)',
            opacity: '0.2'
          },
          '25%': { 
            transform: 'translateY(-15px) translateX(15px) rotate(90deg) scale(1.1)',
            opacity: '0.3'
          },
          '50%': { 
            transform: 'translateY(0) translateX(25px) rotate(180deg) scale(1)',
            opacity: '0.2'
          },
          '75%': { 
            transform: 'translateY(15px) translateX(15px) rotate(270deg) scale(1.1)',
            opacity: '0.3'
          },
          '100%': { 
            transform: 'translateY(0) translateX(0) rotate(360deg) scale(1)',
            opacity: '0.2'
          }
        }
      },
      animation: {
        float: 'float 20s ease-in-out infinite'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 