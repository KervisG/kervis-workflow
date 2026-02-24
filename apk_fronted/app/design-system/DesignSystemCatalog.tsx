import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Button from '../../design-system/components/Button';
import Card from '../../design-system/components/Card';

const DesignSystemCatalog: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
        Design System Catalog
      </Text>
      <View style={{ marginBottom: 12 }}>
        <Button title="Primary Button" onPress={() => {}} />
      </View>
      <View style={{ marginBottom: 12 }}>
        <Card title="Card Demo">
          <Text>Este es un card de ejemplo dentro del design system.</Text>
        </Card>
      </View>
    </ScrollView>
  );
};

export default DesignSystemCatalog;
