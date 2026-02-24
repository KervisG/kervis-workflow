# Reglas del Agente React Native - Versión 1 (ES)

Propósito: Directrices de rendimiento y buenas prácticas para APK-Gym Frontend (Expo/React Native). Proporciona un marco de revisión, puntuación y extensión futura de reglas.

Versión: 1.0

## Activación
- Cuándo aplica: durante Milestone 2–3 (Desarrollo de características) y Phase de QA/Ralph.
- Desencadenantes: “Check Frontend Performance”, “Review component performance”, “Optimize UI”.

## Cómo usar
- Paso 1: Revisar el código contra las reglas CRITICAL y HIGH.
- Paso 2: Marcar incumplimientos con un check en la PR o en el informe de cumplimiento.
- Paso 3: Generar plan de corrección y estimaciones de impacto.

## Catálogo de reglas (plantilla)
- CRITICAL
- HIGH
- MEDIUM
- LOW

### Formato de cada regla (plantilla)
- Nombre corto (ej.: Eliminating Waterfalls)
- Descripción corta
- BAD (antipatrón con ejemplo)
- GOOD (solución recomendada con ejemplo)
- Impacto de rendimiento (alto/mediano/bajo)
- Verificación (manual y/o automática)
- Notas de compatibilidad (RN/Expo, versiones de RN, librerías relevantes)

## Reglas CRITICAL (ejemplos)
- Eliminating Waterfalls
  - Descripción: Evita patrones secuenciales de async que podrían ejecutarse en paralelo.
  - BAD: awaits en secuencia sin branches.
  - GOOD: usar defer/Promise.all/ iniciar promesas temprano cuando sea posible.
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

## Sección NativeWind (Tailwind para React Native)
- Descripción: usar NativeWind para estilizar RN/Expo con clases tipo Tailwind, acelerando desarrollo y manteniendo consistencia con el design system.
- Requisitos: instalar NativeWind, TailwindCSS y PostCSS; añadir configuración de tailwind.config.ts y babel si aplica.
- Mapear tokens a Tailwind: extender theme.colors, theme.spacing, theme.borderRadius, theme.fontSize, etc., para exponer clases como bg-brand-500, p-4, rounded-md, text-sm, etc.
- Migración recomendada: empezar con 1–2 componentes (p. ej., Button y Card) para usar className en lugar de StyleSheet.
- Verificación: asegurar que las clases usadas correspondan a tokens y que no haya conflictos con estilos inline.
- Ejemplos de uso:
  // Button (ejemplo simplificado)
  <TouchableOpacity className="bg-brand-500 py-2 px-4 rounded-md"><Text className="text-white font-semibold">Iniciar</Text></TouchableOpacity>
  
  // Card (ejemplo simplificado)
  <View className="bg-white rounded-md shadow p-4"><Text className="font-bold mb-2">Título</Text><Text>Contenido</Text></View>

### Notas finales
- Tu tailwind.config.ts debe leer los tokens desde tokens.ts para mantener consistencia.
- Añadir un paso de lint para asegurar que se usa className para estilo cuando se usa NativeWind.

## Puntuación de cumplimiento
- Fórmula: skill_score = (pasados / aplicables) × 100
- Umbrales: PASS ≥ 95%, CONDITIONAL 90–94%, FAIL < 90%
- Violaciones CRITICAL bloquean el progreso

## Integración con Ralph
- La puntuación y hallazgos se reflejan en el veredicto; incluir resumen de incumplimientos y plan de mitigación.

## Mantenimiento
- Proceso para actualizar reglas y extender taxonomía.
- Propietarios por regla para mantenimiento.

## Guía de implementación (Rápido)
- Paso inmediato: añadir DS tab en AppTabs y DesignSystemCatalog para validación visual.
- Paso siguiente: extender design system con más componentes y mapearlos a NativeWind.

*** Fin del archivo ES ***
