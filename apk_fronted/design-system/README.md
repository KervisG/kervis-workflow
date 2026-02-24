# APK Gym Frontend Design System (Expo)

Este es un diseño de sistema ligero para estandarizar estilos y componentes en APK-Gym. Está pensado para integrarse con NativeWind (Tailwind para React Native) y una pequeña biblioteca de componentes propios (Button, Card, etc.).

Objetivo
- Proveer tokens de diseño y componentes reutilizables para escalar la UI coherentemente.

Arquitectura recomendada
- Tokens: colors, spacing, radii, typography en `design-system/tokens.ts`.
- Componentes: `design-system/components/*` (Button, Card, etc.).
- Enlace con NativeWind: combinar Tailwind classes con componentes si se desea estilo adicional.

Cómo usar
- Importa Tokens para estilos basados en diseño y usa tus componentes reutilizables. Ejemplo:
  import { Button } from '@apk-gym/design-system';
- Inicia con una paleta de colores de marca, tipografías y radios.

Notas
- Este DS es deliberadamente ligero para facilitar su adopción y extensión. Puedes migrar a Dripsy o NativeBase si necesitas un conjunto de componentes más amplio.
