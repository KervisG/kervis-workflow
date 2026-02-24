# React Native Agent Rules - v1

Propósito: Directrices de rendimiento y mejores prácticas para aplicaciones React Native/Expo, alineadas con el stack actual de APK-Gym Frontend. Proporciona un marco de revisión, puntuación y extensión futura de reglas.

Version: 1.0

## Activación
- Cuándo se aplica: durante Milestone 2–3 (Desarrollo de características) y Phase de QA/ Ralph.
- Desencadenantes: “Check Frontend Performance”, “Review component performance”, “Optimize UI”.

## Cómo usar
- Paso 1: Revisar código contra las reglas CRITICAL y HIGH.
- Paso 2: Marcar incumplimientos con un check en la PR o en el reporte de cumplimiento.
- Paso 3: Generar plan de corrección y estimaciones de impacto.

## Catálogo de reglas (plantilla)
- CRITICAL
- HIGH
- MEDIUM
- LOW

### Formato de cada regla (plantilla)
- Nombre corto (p. ej., Eliminating Waterfalls)
- Descripción corta
- BAD (antipatrón con ejemplo)
- GOOD (solución recomendada con ejemplo)
- Impacto de rendimiento (alto/medio/bajo)
- Verificación (manual y/o automática)
- Notas de compatibilidad (RN/Expo, RN versions, librerías relevantes)

## Reglas CRITICAL (ejemplos)
- Eliminating Waterfalls
  - Descripción: Evita patrones secuenciales de async que podrían ejecutarse en paralelo.
  - BAD: awaits en secuencia sin branches.
  - GOOD: usar defer/Promise.all/ comenzar promesas temprano cuando sea posible.
  - Verificación: revisión estática de flujos async; detectar awaits dependientes que podrían paralelizarse.

- Bundle Optimization
  - Descripción: Evitar imports de barrels para favorecer tree shaking en RN/Expo.
  - BAD: import { A, B } from '@/components';
  - GOOD: imports directos: import { A } from '@/components/A'; import { B } from '@/components/B';
  - Verificación: revisión de imports estáticos y estructura de módulos.

### Reglas HIGH
- List Performance
  - Descripción: Usar FlatList/SectionList para listas dinámicas; evitar ScrollView + .map.
  - BAD: <ScrollView>{items.map(...)} </ScrollView>
  - GOOD: <FlatList data={items} renderItem={...} /> con optimizaciones.
  - Verificación: revisión de componentes de lista en código fuente.

### Reglas MEDIUM
- Re-render Prevention
  - Descripción: Minimizar renders innecesarios usando memo, useCallback, y props estables.
  - BAD: funciones inline y objetos/arrays en props.
  - GOOD: memoizada, useCallback, y constantes para estilos.
  - Verificación: revisión de props enviados a componentes hijos.

- Memory Management
  - Descripción: limpiar suscripciones y recursos (listeners, timers) para evitar pérdidas de memoria.
  - Verificación: presencia de cleanup en useEffect; abort controllers para fetches.

- Animation Performance
  - Descripción: usar useNativeDriver cuando sea posible; preferir Reanimated para animaciones complejas.
  - Verificación: revisión de APIs de Animated y Reanimated; evitar animaciones que bloqueen JS.

### Reglas LOW
- Platform Patterns
  - Descripción: estructurar código por plataforma (DatePicker.ios.tsx / DatePicker.android.tsx) y usar Safe Areas.
  - Verificación: organización de archivos y uso de SafeAreaContext.

## Puntuación de cumplimiento
- Fórmula: skill_score = (pasados / aplicables) × 100
- Umbrales: PASS ≥ 95%, CONDITIONAL 90–94%, FAIL < 90%
- Cualquier violación CRITICAL bloquea el progreso

## Integración con Ralph
- La puntuación y los hallazgos se reportan en el veredicto del QA; incluir un resumen de incumplimientos y plan de mitigación.

## Mantenimiento
- Proceso para actualizar reglas, añadir nuevos ítems y extender la taxonomía.
- Propietarios por regla para mantenimiento.

## Ejemplos de triggers y outputs
- Trigger: "Check Frontend Performance" → Output: lista de incumplimientos + plan de corrección.

## Versiones de referencia
- 1.0 (2026-01-15): Inicio
- Basado en prácticas de rendimiento para RN/Expo; extensible a RN web si aplica.

---
Notas: Este es un draft alineado al stack Expo/React Native utilizado en APK-Gym. Se debe adaptar a versiones específicas de RN/Expo y a librerías exactas en tu proyecto para mayor precisión.

## NativeWind (Tailwind para React Native)
Descripció​n: usar NativeWind para estilizar RN/Expo con clases tipo Tailwind, acelerando desarrollo y manteniendo consistencia con el design system.
- Requisitos: instalar NativeWind, TailwindCSS y PostCSS; añadir configuración de tailwind.config.ts y babel si aplica.
- Mapeo de tokens: mapear Colors, Spacing, Radius, Typography a theme de Tailwind para usar clases como bg-brand-500, p-4, rounded-md, text-sm, etc.
- Migración: empezar con 1–2 componentes (p. ej., Button y Card) para usar className en lugar de StyleSheet.
- Ejemplos de uso:
```tsx
// Button.tsx usando className
import { TouchableOpacity, Text } from 'react-native';
export const Button = ({ title }) => (
  <TouchableOpacity className="bg-brand-500 py-2 px-4 rounded-md">
    <Text className="text-white font-semibold">{title}</Text>
  </TouchableOpacity>
);
```
```tsx
// Card.tsx usando className
import { View, Text } from 'react-native';
export const Card = ({ title, children }) => (
  <View className="bg-white rounded-md shadow p-4">
    {title ? <Text className="font-bold mb-2">{title}</Text> : null}
    {children}
  </View>
);
```
- Verificación: asegurar que las clases que uses correspondan a tokens definidas y que no existan conflictos con estilos inline.
- Notas de implementación: tailwind.config.ts debe exponer colors/spacing/radius y el project babel debe incluir nativewind/babel.
