# Sistema de Diseño APK Gym (ESP)

Este diseño de sistema es un punto de partida ligero para APK Gym Frontend (Expo/React Native) que facilita la consistencia visual y el escalado de UI utilizando NativeWind (Tailwind para RN).

Objetivo
- Proveer tokens de diseño y componentes reutilizables para acelerar el desarrollo y mantener una experiencia visual coherente.

Estructura recomendada
- Tokens: apk_fronted/design-system/tokens.ts
- Componentes: apk_fronted/design-system/components/ (Button.tsx, Card.tsx, etc.)
- Export público: apk_fronted/design-system/index.ts
- Catálogo de UI (opcional): apk_fronted/app/design-system/DesignSystemCatalog.tsx
- Configuración de Tailwind: apk_fronted/tailwind.config.ts

Cómo usar
- Importa tokens desde design-system/tokens.ts para colores, espaciado, radios y tipografía.
- Estiliza con NativeWind usando className en lugar de StyleSheet cuando sea posible.
- Importa y usa los componentes base (Button, Card) para construir interfaces consistentes.
- Si usas Tailwind, expón tus tokens en tailwind.config.ts para un mapeo directo a clases (p. ej., bg-brand-500, p-4, rounded-md).

Ejemplos rápidos
- Button
  <Button title="Iniciar" onPress={...} variant="solid" />
- Card
  <Card title="Resumen"><Text>Contenido</Text></Card>

Notas
- Este DS es escalable: añade nuevos componentes y extiende tailwind.config.ts conforme crezca la UI.
- Mantén sincronizados tokens.ts y tailwind.config.ts para evitar desalineaciones.
