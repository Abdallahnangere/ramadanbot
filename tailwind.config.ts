import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Apple System Palette
        ios: {
          bg: '#F2F2F7',
          card: '#FFFFFF',
          blue: '#007AFF',
          teal: '#30B0C7',
          green: '#34C759',
          red: '#FF3B30',
          gray: '#8E8E93',
          lightGray: '#E5E5EA',
          separator: '#C6C6C8',
          dark: {
            bg: '#000000',
            card: '#1C1C1E',
            input: '#2C2C2E',
            text: '#FFFFFF',
            subtext: '#8E8E93'
          }
        },
        primary: {
          500: '#007AFF',
          600: '#0062cc',
        },
        // Extended Apple-grade palette
        surface: {
          light: '#FAFAFA',
          DEFAULT: '#FFFFFF',
          elevated: 'rgba(255,255,255,0.72)',
          dim: '#F5F5F5',
        },
        'surface-dark': {
          light: '#1C1C1E',
          DEFAULT: '#000000',
          elevated: 'rgba(28,28,30,0.72)',
          dim: '#2C2C2E',
        },
        text: {
          primary: '#000000',
          secondary: 'rgba(0,0,0,0.6)',
          tertiary: 'rgba(0,0,0,0.3)',
        },
        'text-dark': {
          primary: '#FFFFFF',
          secondary: 'rgba(255,255,255,0.6)',
          tertiary: 'rgba(255,255,255,0.3)',
        },
      },
      typography: {
        // Apple Typography Scale
        'title-lg': {
          fontSize: '34px',
          fontWeight: '700',
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
        },
        'title': {
          fontSize: '28px',
          fontWeight: '700',
          lineHeight: '1.2',
          letterSpacing: '-0.01em',
        },
        'heading': {
          fontSize: '22px',
          fontWeight: '600',
          lineHeight: '1.3',
        },
        'subheading': {
          fontSize: '20px',
          fontWeight: '600',
          lineHeight: '1.3',
        },
        'body': {
          fontSize: '17px',
          fontWeight: '400',
          lineHeight: '1.5',
        },
        'body-emphasis': {
          fontSize: '17px',
          fontWeight: '600',
          lineHeight: '1.5',
        },
        'caption': {
          fontSize: '15px',
          fontWeight: '400',
          lineHeight: '1.4',
          color: 'rgba(0,0,0,0.6)',
        },
        'caption-emphasis': {
          fontSize: '15px',
          fontWeight: '600',
          lineHeight: '1.4',
        },
        'footnote': {
          fontSize: '13px',
          fontWeight: '400',
          lineHeight: '1.3',
          color: 'rgba(0,0,0,0.6)',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Inter', 'Geist', 'sans-serif'],
        serif: ['Georgia', 'Garamond', 'serif'],
      },
      fontSize: {
        'title-lg': '34px',
        'title': '28px',
        'heading': '22px',
        'subheading': '20px',
        'body': '17px',
        'caption': '15px',
        'footnote': '13px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'base': '16px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '48px',
      },
      borderRadius: {
        'xs': '6px',
        'sm': '10px',
        'base': '12px',
        'md': '14px',
        'lg': '18px',
        'xl': '24px',
        'full': '9999px',
        'squircle': '18px', // Apple squircle approximation
      },
      boxShadow: {
        'xs': 'rgb(0 0 0 / 0.05) 0px 1px 2px 0px',
        'sm': `0 1px 2px rgba(0,0,0,0.04),
                0 4px 16px rgba(0,0,0,0.06),
                0 0 0 1px rgba(0,0,0,0.06)`,
        'base': `0 1px 3px rgba(0,0,0,0.06),
                 0 8px 24px rgba(0,0,0,0.12),
                 0 0 0 1px rgba(0,0,0,0.08)`,
        'md': `0 2px 8px rgba(0,0,0,0.08),
               0 16px 32px rgba(0,0,0,0.16),
               0 0 0 1px rgba(0,0,0,0.06)`,
        'lg': `0 4px 12px rgba(0,0,0,0.12),
               0 24px 48px rgba(0,0,0,0.18),
               0 0 0 1px rgba(0,0,0,0.08)`,
        'xl': `0 8px 24px rgba(0,0,0,0.15),
               0 32px 64px rgba(0,0,0,0.2),
               0 0 0 1px rgba(0,0,0,0.1)`,
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'ios': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'none': 'none',
      },
      backdropFilter: {
        'none': 'none',
        'sm': 'blur(10px) saturate(160%)',
        'base': 'blur(20px) saturate(180%)',
        'md': 'blur(30px) saturate(200%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;