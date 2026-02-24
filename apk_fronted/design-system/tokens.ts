// Design tokens para APK Gym Frontend (Expo/React Native)
// Este archivo define colores, espaciados y radios para facilitar el escalado del UI.

export const Colors = {
  brand: {
    50: '#f5faff',
    100: '#e8f0ff',
    200: '#cbdcff',
    300: '#a6b8ff',
    400: '#7a8cff',
    500: '#4f65ff', // color primario
    600: '#4058ff',
  },
  surface: '#ffffff',
  text: '#1f2937',
  gray: '#6b7280',
  danger: '#ef4444',
  success: '#10b981',
};

export const Radius = {
  sm: 6,
  md: 12,
  lg: 16,
};

export const Spacing = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const Typography = {
  fontFamily: 'Inter, system-ui, -apple-system',
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xl2: 24,
  },
  weight: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
};

export default {
  Colors,
  Radius,
  Spacing,
  Typography,
};
