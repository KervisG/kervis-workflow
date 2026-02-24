import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string; // NativeWind className prop
};

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'solid', size = 'md', className }) => {
  // Map sizes a clases de Tailwind (simulando con utilidades de NativeWind)
  const sizeClass = size === 'sm' ? 'py-1.5 px-3' : size === 'md' ? 'py-2.5 px-4' : 'py-3.5 px-6';
  const variantClass = variant === 'solid' ? 'bg-brand-500' : 'border border-brand-500 bg-transparent';
  const textClass = variant === 'solid' ? 'text-white' : 'text-brand-500';
  const base = 'rounded-md';

  // @ts-ignore: className is processed by NativeWind at runtime
  return (
    <TouchableOpacity onPress={onPress} className={`${variantClass} ${sizeClass} ${base} ${className ?? ''}`}>
      <Text className={`${textClass} font-semibold`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
