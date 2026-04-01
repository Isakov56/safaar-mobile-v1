/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1A1A1A',
          soft: '#4A4A4A',
          muted: '#8A8A8A',
        },
        surface: '#FFFFFF',
        canvas: {
          DEFAULT: '#FAF8F4',
          deep: '#F2EDE4',
        },
        gold: {
          DEFAULT: '#C4993C',
          soft: '#E8D5A8',
          deep: '#8B6914',
        },
        deep: {
          DEFAULT: '#2C1810',
          accent: '#D4A843',
        },
        fun: {
          DEFAULT: '#0D1B2A',
          accent: '#4FC3F7',
        },
        success: {
          DEFAULT: '#2E7D32',
          soft: '#E8F5E9',
        },
        warning: {
          DEFAULT: '#E65100',
          soft: '#FFF3E0',
        },
        error: '#C62828',
        hot: '#E53935',
        traveler: '#FF8A65',
        local: '#66BB6A',
      },
      fontFamily: {
        serif: ['SourceSerif4-Regular', 'serif'],
        'serif-semibold': ['SourceSerif4-SemiBold', 'serif'],
        'serif-bold': ['SourceSerif4-Bold', 'serif'],
        'serif-extrabold': ['SourceSerif4-ExtraBold', 'serif'],
      },
      fontSize: {
        xs: ['11px', '16px'],
        sm: ['13px', '18px'],
        base: ['15px', '22px'],
        lg: ['18px', '26px'],
        xl: ['22px', '30px'],
        '2xl': ['28px', '36px'],
        brand: ['32px', '38px'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
      },
      borderRadius: {
        card: '16px',
        button: '12px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        modal: '0 16px 48px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
