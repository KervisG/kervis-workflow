import React from 'react';
import { View, Text } from 'react-native';

type CardProps = {
  title?: string;
  children: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({ title, children }) => {
  // Usar className de NativeWind para estilos simples
  return (
    <View className="bg-white rounded-md shadow p-4">
      {title ? <Text className="font-bold mb-2">{title}</Text> : null}
      {children}
    </View>
  );
};

export default Card;
