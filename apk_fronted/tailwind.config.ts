import type { Config } from 'tailwindcss';

// Tailwind config wired to APK-Gym design tokens
const config: Config = {
  content: [
    './apk_fronted/**/*.{ts,tsx}',
    './apk_fronted/design-system/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5faff',
          100: '#e8f0ff',
          200: '#cbdcff',
          300: '#a6b8ff',
          400: '#7a8cff',
          500: '#4f65ff',
          600: '#4058ff',
        },
        surface: '#ffffff',
        text: '#1f2937',
        gray: '#6b7280',
        danger: '#ef4444',
        success: '#10b981',
      },
      borderRadius: {
        md: 12,
      },
      spacing: {
        xs: 6,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
      },
      fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Arial'],
      },
    },
  },
  plugins: [],
};

export default config;
