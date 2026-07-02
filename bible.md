# Vigesu: La Biblia del Proyecto (bible.md)

Este documento contiene las reglas irrompibles, los principios de diseño y la arquitectura base del proyecto **Vigesu**. Todo desarrollador debe conocer y aplicar estos principios para garantizar la escalabilidad y mantenibilidad.

## 1. Arquitectura del Proyecto (Feature-Sliced Design)

El proyecto sigue una arquitectura modular basada en **Domain-Driven Design (DDD)** simplificado y **Feature-Sliced Design**. No mezclamos responsabilidades.

```text
src/
├── app/            # Vistas principales (Next.js App Router)
├── core/           # Configuración base (Axios, utils genéricas, constantes)
├── entities/       # Modelos de negocio, tipos estrictos e interfaces puras
├── features/       # Lógica específica del negocio (hooks, componentes específicos de un dominio)
├── presentation/   # UI pura, componentes reutilizables (Botones, Inputs), Stores de Zustand compartidos
└── widgets/        # Bloques complejos de UI formados por features y entities (ej. Header, Sidebar)
```

**Regla de Oro:** Un módulo inferior no puede importar de un módulo superior (ej. `entities` no debe importar de `features`).

## 2. Tipado Estricto (TypeScript)

El uso de `any` está **ESTRICTAMENTE PROHIBIDO**. 

- Todas las interfaces del backend deben mapearse en `src/entities`.
- **Zod** se usa obligatoriamente para validaciones en el runtime (formularios y/o esquemas complejos).
- Usa `unknown` en lugar de `any` si desconoces la respuesta de un servicio, y luego valídalo (Type Guards o Zod).
- Las Props de los componentes React deben usar interfaces `Props` en lugar de objetos implícitos o genéricos sin definir.

## 3. Manejo de Estado

### 3.1. Estado Global (Zustand)
Utilizamos **Zustand** en `src/presentation/stores` o `src/features/[feature]/stores` para el estado global que afecta a toda la aplicación o a un dominio específico a lo largo de varias vistas (ej. Autenticación, Preferencias de Usuario, Carrito de Compras).
- Nunca uses Redux o Context API para estado global complejo. Zustand es nuestro estándar.

### 3.2. Estado Local (React useState / useReducer)
Para estado que vive y muere dentro de un mismo componente (modal abierto, input de búsqueda local, tab seleccionado), se debe utilizar `useState` de React. No ensucies el Store Global con estados efímeros.

## 4. Peticiones HTTP y Gestión de Datos

- **Axios** es el cliente HTTP oficial del proyecto. Existe una instancia centralizada en `src/core/utils/axiosInstance.ts` con interceptores para enviar siempre el token en las peticiones.
- No hacer fetchs sueltos en componentes. Las peticiones deben vivir en llamadas encapsuladas (preferiblemente en Custom Hooks que llamen a servicios o usando librerías como React Query/SWR si en el futuro se implementan, de lo contrario, Hooks nativos con `useEffect` controlados).

## 5. Manejo de Errores y Toast

- Todo error proveniente del backend debe capturarse en un bloque `try/catch`.
- Se debe mostrar un feedback claro al usuario usando **Sonner** (`toast.error` o `toast.success`).
- Los errores deben traducirse a mensajes amigables al usuario utilizando `next-intl` (ej. `tToasts('error.network')`). No mostrar mensajes puros del backend al usuario final, a menos que sean controlados.

## 6. CSS y Estilos (TailwindCSS)

- **TailwindCSS** es la base para todo el diseño.
- Si un componente necesita estilos muy dinámicos o complejos que no son legibles con utilidades puras, está permitido el uso de CSS Modules (`style.module.scss`).
- Nunca usar CSS global a menos que sea en el `app/globals.css` para definir el Theme (Variables CSS).

Sigue estos principios y la aplicación se mantendrá limpia y libre de deuda técnica.
