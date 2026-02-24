# Reglas del Agente React Native - APK Gym v2

Directrices de rendimiento, convenciones y buenas practicas para el frontend de APK-Gym (Expo/React Native). Este documento es la fuente unica de verdad para revision de codigo, cumplimiento y calidad del frontend.

Version: 2.0

---

## 1. Stack y Versiones

| Dependencia | Version | Rol |
|---|---|---|
| Expo | ~54.0.23 | Plataforma base |
| React | 19.1.0 | UI framework |
| React Native | 0.81.5 | Runtime movil (New Architecture habilitada) |
| TypeScript | ~5.9.2 | Tipado estatico |
| @react-navigation/native | ^7.1.19 | Navegacion principal |
| @react-navigation/native-stack | ^7.6.2 | Stack screens |
| @react-navigation/bottom-tabs | ^7.8.4 | Tab navigation |
| zustand | ^5.0.9 | Estado global con persist |
| @tanstack/react-query | ^5.90.12 | Data fetching, cache, mutations |
| react-hook-form | ^7.66.1 | Formularios |
| @hookform/resolvers | ^5.2.2 | Puente RHF-Yup |
| yup | ^1.7.1 | Validacion de schemas |
| nativewind | ^4.2.1 | Estilos via className (Tailwind para RN) |
| tailwindcss | ^3.4.18 | Configuracion de NativeWind |
| axios | ^1.13.2 | Cliente HTTP |
| @react-native-async-storage/async-storage | ^2.2.0 | Persistencia local |
| react-native-reanimated | ~4.1.1 | Animaciones complejas |
| react-native-gesture-handler | ~2.28.0 | Gestos |
| react-native-safe-area-context | ~5.6.0 | Safe areas |
| expo-linear-gradient | ~15.0.7 | Gradientes |
| lucide-react-native | ^0.553.0 | Iconos modernos |
| @expo/vector-icons | ^15.0.3 | Iconos (Ionicons, MaterialCommunityIcons) |

---

## 2. Convenciones de Codigo

### 2.1 Estilos

- SIEMPRE usar `className` con NativeWind. NO usar `StyleSheet.create`.
- Paleta de colores: usar tokens `shark-*` definidos en `tailwind.config.js` (blood, ocean, skin, abyss, 50-950).
- Inline `style={{}}` solo permitido para: valores dinamicos calculados en runtime o estilos de `Animated.View`.
- Una sola fuente de verdad para colores: `tailwind.config.js`. No duplicar en archivos separados.

```tsx
// BAD
const styles = StyleSheet.create({ container: { backgroundColor: '#1a1a2e' } });
<View style={styles.container} />

// GOOD
<View className="bg-shark-950" />
```

### 2.2 Imports

- Usar alias `@/` para imports desde la raiz del proyecto.
- NO mezclar imports relativos (`../`) con alias (`@/`) en el mismo archivo.
- Preferir imports directos sobre barrel imports para componentes de UI.

```tsx
// BAD
import { sharkColors } from "../../theme/color";
import { FeatureCard } from "@/app/home/components/FeatureCard";

// GOOD
import { FeatureCard } from "@/app/home/components/FeatureCard";
import { sharkColors } from "@/app/theme/color";
```

### 2.3 Exports

- `export default` para screens y paginas completas.
- `export named` para componentes reutilizables, hooks, servicios y tipos.

### 2.4 Formularios

- Usar `react-hook-form` con `Controller` y `yupResolver`.
- Un unico schema Yup por formulario, sin duplicar en multiples ubicaciones.

### 2.5 Estado Global

- Usar Zustand con middleware `persist` para estado que necesite sobrevivir al cierre de la app.
- NO mezclar hooks legacy de estado (`useState` para auth) con stores de Zustand para la misma data.
- Un unico patron de acceso al estado: selectores individuales de Zustand.

```tsx
// BAD
const [user, setUser] = useState(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);

// GOOD
const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
```

### 2.6 Data Fetching

- Usar React Query (`useQuery`, `useMutation`) para toda comunicacion con APIs.
- NO manejar loading/error con `useState` manual cuando React Query esta disponible.
- Usar la instancia `api` de `@/config/axios` (incluye interceptors y logging).

```tsx
// BAD
const [data, setData] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
useEffect(() => {
  setIsLoading(true);
  api.get('/endpoint').then(setData).catch(setError).finally(() => setIsLoading(false));
}, []);

// GOOD
const { data, isLoading, error } = useQuery({
  queryKey: ['endpoint'],
  queryFn: () => api.get('/endpoint').then(res => res.data),
});
```

### 2.7 Safe Areas

- SIEMPRE importar `SafeAreaView` desde `react-native-safe-area-context`.
- NUNCA importar `SafeAreaView` desde `react-native` (no funciona correctamente en Android con edge-to-edge).

```tsx
// BAD
import { SafeAreaView } from 'react-native';

// GOOD
import { SafeAreaView } from 'react-native-safe-area-context';
```

### 2.8 Iconos

- Nuevos iconos: usar `lucide-react-native`.
- Iconos ya existentes en el proyecto: mantener `@expo/vector-icons` (Ionicons, MaterialCommunityIcons).

### 2.9 Navegacion

- Tipar las rutas de navegacion. Evitar casts `as never`.
- Definir `RootStackParamList` con todas las rutas y sus parametros.

### 2.10 Logging

- `console.log` solo permitido dentro de `if (__DEV__)` o usando el `errorHandler` del proyecto.
- Eliminar console.log antes de merge a main.

---

## 3. Reglas CRITICAL

Cualquier violacion CRITICAL bloquea el merge/progreso.

### 3.1 Eliminar Waterfalls Async

Operaciones async independientes deben ejecutarse en paralelo con `Promise.all`.

```tsx
// BAD
const token = await AsyncStorage.getItem("token");
const user = await AsyncStorage.getItem("user");

// GOOD
const [token, user] = await Promise.all([
  AsyncStorage.getItem("token"),
  AsyncStorage.getItem("user"),
]);
```

Mover `await` a la rama donde realmente se necesita el dato:

```tsx
// BAD
async function handleAction(userId: string, skip: boolean) {
  const data = await fetchData(userId);
  if (skip) return { skipped: true };
  return processData(data);
}

// GOOD
async function handleAction(userId: string, skip: boolean) {
  if (skip) return { skipped: true };
  const data = await fetchData(userId);
  return processData(data);
}
```

- Verificacion: buscar `await` consecutivos sobre operaciones independientes. Buscar `await` antes de condicionales que podrian retornar temprano.

### 3.2 Estado Unificado (Zustand)

No debe haber dos fuentes de verdad para el mismo estado. Si existe un store de Zustand para un dominio (auth, user, etc.), todo el proyecto debe consumir ese store.

```tsx
// BAD - hook legacy con useState local para auth
function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // ... leer de AsyncStorage manualmente
}

// GOOD - consumir Zustand store directamente
const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
```

- Verificacion: buscar hooks con `useState` que manejen datos ya cubiertos por un store de Zustand.

### 3.3 React Query para Data Fetching

Toda comunicacion con APIs debe usar `useQuery` o `useMutation`. No reinventar loading/error/cache con `useState`.

```tsx
// BAD
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(false);
useEffect(() => {
  setLoading(true);
  api.get('/users').then(r => setUsers(r.data)).finally(() => setLoading(false));
}, []);

// GOOD
const { data: users, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: () => api.get('/users').then(r => r.data),
});
```

Para mutaciones (login, register, create, update, delete):

```tsx
// GOOD
const loginMutation = useMutation({
  mutationFn: (credentials: LoginCredentials) => api.post('/auth/login', credentials),
  onSuccess: (data) => {
    authStore.setSessionFromLogin(data);
  },
});
```

- Verificacion: buscar `useState` + `useEffect` + llamadas API. Deberian ser `useQuery`/`useMutation`.

### 3.4 Configuracion Correcta de Babel

Toda libreria instalada que requiera un plugin de babel DEBE tener su plugin activo. Plugins comentados causan fallos silenciosos.

```javascript
// BAD - plugin comentado pero libreria importada y usada
plugins: [
  // "react-native-reanimated/plugin",  // COMENTADO pero reanimated esta instalado
]

// GOOD - plugin activo si la libreria se usa
plugins: [
  "react-native-reanimated/plugin",  // SIEMPRE al final de la lista
]
```

- Verificacion: comparar dependencias de `package.json` con plugins de `babel.config.cjs`. Todo plugin requerido debe estar activo.

---

## 4. Reglas HIGH

### 4.1 Listas Virtualizadas

Usar `FlatList` o `SectionList` para listas dinamicas. NUNCA `ScrollView` con `.map()` para listas que puedan crecer.

```tsx
// BAD
<ScrollView>
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</ScrollView>

// GOOD
<FlatList
  data={items}
  renderItem={({ item }) => <ItemCard item={item} />}
  keyExtractor={item => item.id}
  removeClippedSubviews
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

NUNCA anidar `FlatList` dentro de `ScrollView`. Esto desactiva la virtualizacion y genera warnings.

```tsx
// BAD
<ScrollView>
  <HeaderComponent />
  <FlatList data={items} renderItem={renderItem} />
</ScrollView>

// GOOD - usar ListHeaderComponent
<FlatList
  data={items}
  renderItem={renderItem}
  ListHeaderComponent={<HeaderComponent />}
/>
```

- Verificacion: buscar `ScrollView` con `.map()` y `FlatList` dentro de `ScrollView`.

### 4.2 Memoizacion Obligatoria

Todo componente que se pase como `renderItem` de una lista DEBE estar envuelto en `React.memo`.

Handlers pasados como props DEBEN usar `useCallback`.

Calculos costosos DEBEN usar `useMemo`.

```tsx
// BAD
const ItemCard = ({ item }) => <View><Text>{item.title}</Text></View>;

function Parent() {
  return <FlatList
    data={items}
    renderItem={({ item }) => <ItemCard item={item} />}
  />;
}

// GOOD
const ItemCard = memo(({ item }: Props) => <View><Text>{item.title}</Text></View>);

function Parent() {
  const renderItem = useCallback(({ item }) => <ItemCard item={item} />, []);
  return <FlatList data={items} renderItem={renderItem} />;
}
```

- Verificacion: buscar componentes usados en `renderItem` sin `memo`. Buscar funciones inline en props de componentes hijos.

### 4.3 SafeAreaView Correcto

Importar SIEMPRE desde `react-native-safe-area-context`, NUNCA desde `react-native`.

```tsx
// BAD
import { SafeAreaView } from 'react-native';

// GOOD
import { SafeAreaView } from 'react-native-safe-area-context';
// o usar el hook para control granular:
import { useSafeAreaInsets } from 'react-native-safe-area-context';
```

- Verificacion: buscar `import.*SafeAreaView.*from.*react-native` que no sea `react-native-safe-area-context`.

### 4.4 Cleanup en useEffect

Todo `useEffect` que cree suscripciones, timers, listeners o inicie operaciones async DEBE retornar una funcion de cleanup.

```tsx
// BAD
useEffect(() => {
  const sub = AppState.addEventListener('change', handler);
  fetchData().then(setData);
}, []);

// GOOD
useEffect(() => {
  const sub = AppState.addEventListener('change', handler);
  const controller = new AbortController();

  fetchData({ signal: controller.signal })
    .then(setData)
    .catch(e => { if (e.name !== 'AbortError') throw e; });

  return () => {
    sub.remove();
    controller.abort();
  };
}, []);
```

Para animaciones:

```tsx
// BAD
useEffect(() => {
  Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
}, []);

// GOOD
useEffect(() => {
  const anim = Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true });
  anim.start();
  return () => anim.stop();
}, []);
```

- Verificacion: buscar `useEffect` sin `return () =>`.

---

## 5. Reglas MEDIUM

### 5.1 NativeWind como Unico Sistema de Estilos

- Usar `className` para todo. NO crear archivos de constantes de colores que dupliquen `tailwind.config.js`.
- Si necesitas un color en JS (no en className), leerlo desde la config de Tailwind o desde un unico archivo de tokens.

- Verificacion: buscar `StyleSheet.create`, archivos duplicados de colores, `style={{}}` sin justificacion.

### 5.2 Schemas de Validacion sin Duplicar

Un schema Yup por formulario, en una sola ubicacion. Si multiples pantallas usan el mismo formulario, importar el mismo schema.

```
// BAD - schema en 3 lugares distintos
auth/validations/schemas.ts       -> loginSchema
auth/login/validations/loginSchema.ts -> loginSchema (duplicado)

// GOOD - un solo archivo, multiples consumidores
auth/login/validations/loginSchema.ts -> loginSchema (unica fuente)
auth/login/hooks/useLoginForm.ts     -> import { loginSchema } from '../validations/loginSchema'
```

- Verificacion: buscar schemas con el mismo nombre en diferentes archivos.

### 5.3 Console.log Controlado

```tsx
// BAD
console.log('User data:', userData);

// GOOD
if (__DEV__) {
  console.log('User data:', userData);
}

// MEJOR - usar el errorHandler del proyecto
import { logError } from '@/app/utils/errorHandler';
```

- Verificacion: buscar `console.log` fuera de bloques `__DEV__`.

### 5.4 No Instalar sin Usar

Toda dependencia en `package.json` debe estar en uso activo. Revisar periodicamente y eliminar:
- Librerias instaladas sin importar en ningun archivo.
- `@types/*` para paquetes que ya incluyen sus propios tipos (ej: axios).
- Devtools que no funcionan en el entorno target (ej: react-query-devtools en RN nativo).

- Verificacion: buscar dependencias en `package.json` que no aparezcan en ningun import.

### 5.5 Navegacion Tipada

Definir tipos para las rutas de navegacion. Eliminar casts `as never`.

```tsx
// BAD
navigation.navigate("LoginScreen" as never);

// GOOD
type RootStackParamList = {
  Home: undefined;
  LoginScreen: undefined;
  Profile: { userId: string };
};

navigation.navigate("LoginScreen");
```

- Verificacion: buscar `as never` en llamadas de navegacion.

---

## 6. Reglas LOW

### 6.1 Archivos por Plataforma

Para diferencias significativas entre iOS y Android, usar extensiones de plataforma.

```
// Para diferencias grandes
DatePicker.ios.tsx
DatePicker.android.tsx

// Para diferencias pequenas
Platform.select({ ios: { ... }, android: { ... } })
```

### 6.2 Limpieza de Estructura

- Eliminar carpetas vacias o scaffolding sin implementar.
- Los archivos de tipos deben tener nombres que reflejen su contenido real.

---

## 7. NativeWind y Estilos

### 7.1 Configuracion

- `tailwind.config.js` es la fuente unica de tokens de diseno.
- Preset: `nativewind/preset`.
- Content paths deben cubrir todos los directorios con componentes.
- `babel.config.cjs` debe incluir `nativewind/babel` como preset.
- `jsxImportSource: "nativewind"` en tsconfig y babel.

### 7.2 Paleta de Colores (shark-*)

Usar los tokens definidos en `tailwind.config.js` bajo `shark`:

| Token | Uso tipico |
|---|---|
| `shark-950`, `shark-abyss` | Fondos principales oscuros |
| `shark-900`, `shark-800` | Fondos secundarios, bordes |
| `shark-blood` | Acentos rojos, CTAs |
| `shark-ocean` | Acentos azules, links |
| `shark-skin` | Texto claro sobre fondos oscuros |
| `white`, `white/XX` | Texto y bordes con opacidad |

### 7.3 Cuando Usar Inline style

Solo permitido para:
- Valores dinamicos calculados en runtime: `style={{ width: \`${percentage}%\` }}`
- Estilos de `Animated.View`: `style={[animatedStyle, { paddingHorizontal: 24 }]}`
- Posicionamiento absoluto complejo que no tenga equivalente en Tailwind

### 7.4 Ejemplo de Componente con NativeWind

```tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { memo } from 'react';

type FeatureCardProps = {
  title: string;
  description: string;
  onPress: () => void;
};

export const FeatureCard = memo(({ title, description, onPress }: FeatureCardProps) => (
  <TouchableOpacity
    className="bg-shark-900 rounded-2xl p-4 border border-shark-800"
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text className="text-white text-lg font-bold mb-1">{title}</Text>
    <Text className="text-shark-skin text-sm">{description}</Text>
  </TouchableOpacity>
));
```

---

## 8. Deuda Tecnica y Plan de Correccion

### Sprint 1 - Urgente (CRITICAL)

| # | Problema | Accion |
|---|---|---|
| 1 | Estado auth desincronizado: coexisten hook legacy (useState) y store Zustand para la misma data | Eliminar hook legacy. Usar unicamente el store de Zustand en toda la app |
| 2 | React Query configurado pero no adoptado: toda la app usa useState manual para loading/error | Migrar servicios API a useQuery/useMutation. Empezar por login y register |
| 3 | Plugin de Reanimated comentado en babel.config.cjs: la libreria esta instalada e importada pero el plugin esta inactivo | Descomentar `react-native-reanimated/plugin` (debe ir al final de la lista de plugins) |
| 4 | Waterfalls de AsyncStorage: lecturas/escrituras secuenciales que podrian ser paralelas | Refactorizar a Promise.all donde haya await consecutivos sobre AsyncStorage |

### Sprint 2 - Importante (HIGH)

| # | Problema | Accion |
|---|---|---|
| 5 | FlatList anidado dentro de ScrollView en pantalla principal: desactiva virtualizacion | Usar ListHeaderComponent/ListFooterComponent en un solo FlatList |
| 6 | Zero memoizacion en todo el proyecto: ningun memo, useCallback ni useMemo | Agregar memo a componentes de lista, useCallback a handlers, useMemo a calculos costosos |
| 7 | SafeAreaView importado de react-native (no de safe-area-context) en pantalla de perfil | Cambiar import a react-native-safe-area-context |
| 8 | Schemas Yup duplicados en 3 ubicaciones distintas con valores diferentes | Consolidar a un schema unico por formulario en su carpeta de validaciones |
| 9 | Doble manejo de errores en login: hook lanza error Y screen lo recaptura | Centralizar manejo de errores en un solo nivel (React Query onError o el hook) |

### Sprint 3 - Mejora (MEDIUM/LOW)

| # | Problema | Accion |
|---|---|---|
| 10 | Archivo de colores duplica tailwind.config.js | Eliminar archivo de constantes. Usar tailwind.config.js como fuente unica |
| 11 | console.log en servicios y screens sin guardia __DEV__ | Envolver en __DEV__ o eliminar |
| 12 | Navegacion sin tipado (casts as never) | Definir RootStackParamList y tipar navigators |
| 13 | Librerias instaladas sin usar: drawer, react-query-devtools, @types/axios, worklets | Eliminar de package.json |
| 14 | Archivo de tipos con nombre incorrecto (home/types/auth.ts contiene tipos de Home) | Renombrar a home/types/home.ts |
| 15 | Carpetas vacias (diet/, trainer/, screens/) sin implementar | Eliminar hasta que se necesiten |
| 16 | Clases singleton innecesarias para servicios con un solo metodo | Refactorizar a funciones exportadas simples |
| 17 | Caracter suelto (typo) en pantalla de registro | Eliminar |
| 18 | Imports inconsistentes: mezcla de @/ y relativos en mismo archivo | Unificar a @/ |
| 19 | Doble borde visual en input de password por estilos superpuestos | Eliminar borde redundante del wrapper o del componente |
| 20 | Animaciones con API legacy (Animated) en lugar de Reanimated | Migrar a Reanimated cuando el plugin este activo (ver Sprint 1 #3) |

---

## 9. Puntuacion de Cumplimiento

### Formula

```
skill_score = (reglas_cumplidas / reglas_aplicables) x 100
```

### Umbrales

| Estado | Rango | Accion |
|---|---|---|
| PASS | >= 95% | Proceder normalmente |
| CONDITIONAL | 90-94% | Corregir antes del siguiente milestone |
| FAIL | < 90% | Debe corregirse antes de merge |
| BLOCKED | Cualquier violacion CRITICAL | No se puede hacer merge |

### Checklist para PR

```
CRITICAL (bloquean merge)
- [ ] No hay waterfalls async (await consecutivos independientes)
- [ ] Estado unificado (no mezclar useState legacy con Zustand para misma data)
- [ ] Data fetching con React Query (no useState manual para API calls)
- [ ] Plugins de babel activos para toda libreria que lo requiera

HIGH (deben corregirse)
- [ ] Listas usan FlatList/SectionList (no ScrollView+map para listas dinamicas)
- [ ] No hay FlatList dentro de ScrollView
- [ ] Componentes de lista usan memo, handlers usan useCallback
- [ ] SafeAreaView importado de react-native-safe-area-context
- [ ] useEffect con cleanup cuando corresponde

MEDIUM (corregir antes de siguiente milestone)
- [ ] Estilos con className (no StyleSheet.create)
- [ ] Schemas Yup sin duplicar
- [ ] console.log dentro de __DEV__
- [ ] No hay dependencias sin usar
- [ ] Navegacion tipada (sin as never)

LOW (documentar para futuro)
- [ ] Archivos por plataforma cuando aplique
- [ ] Estructura limpia (sin carpetas vacias)
```

---

## 10. Mantenimiento

### Como Agregar una Regla

1. Definir nombre, descripcion, BAD/GOOD, verificacion.
2. Asignar severidad (CRITICAL/HIGH/MEDIUM/LOW).
3. Agregar a la seccion correspondiente de este documento.
4. Actualizar la checklist de PR.
5. Incrementar version del documento.

### Versionado

- MAJOR: cambio de estructura o eliminacion de reglas.
- MINOR: nuevas reglas o ajuste de severidades.
- PATCH: correcciones de texto o ejemplos.

### Historial

| Version | Fecha | Cambios |
|---|---|---|
| 1.0 | 2026-01-15 | Draft inicial generico |
| 2.0 | 2026-02-24 | Reescritura completa: stack real, convenciones, reglas con BAD/GOOD, deuda tecnica con plan de correccion, checklist para PR |
