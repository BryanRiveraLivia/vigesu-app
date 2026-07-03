# Design Document (design.md)

Este documento está diseñado específicamente para ser procesado por herramientas de generación de interfaces de IA (como **Google Stitch**) para construir todo el flujo visual y UX de la aplicación **Vigesu**.

## Información Global y Tema Base

- **Propósito**: Vigesu es una plataforma web (CRM / Gestor de Documentos y Órdenes de Trabajo) orientada a la administración de un negocio con integración a QuickBooks.
- **Estética**: Diseño moderno, minimalista pero robusto, enfocado en legibilidad de datos. Estilo "SaaS Premium" corporativo.
- **Paleta de Colores (Tailwind):**
  - Primario: `slate-900` (Modo oscuro / Textos base).
  - Acento: `blue-600` (Botones primarios, enlaces).
  - Fondo Global: `gray-50` (Muy claro para dashboards).
  - Elementos de Tarjeta: `white` con bordes suaves (`border-gray-200`) y sombras (`shadow-sm`).
- **Tipografía**: Fuente optimizada (Next/font Geist) - clara, sans-serif, pesos regulares y bold para jerarquía.
- **Comportamientos**: Efectos `hover` sutiles en botones y enlaces. Micro-animaciones en apertura de modales (escalado / fade-in).

---

## Flujo 1: Login / Autenticación (Punto de Entrada)

**Path:** `/` o `/es`
**Objetivo**: Permitir al usuario iniciar sesión en el sistema y posiblemente vincularse a QuickBooks de forma asíncrona.

- **Layout**: Pantalla dividida (Split Screen). 50% Izquierda Formulario, 50% Derecha Imagen promocional (fondo oscuro o imagen corporativa).
- **Componentes Izquierda (Formulario):**
  - **Header Superior**: Logo "VIGESU" en bold (izq) y selector de idiomas (der).
  - **Contenedor Central**:
    - Título `H1`: "Iniciar Sesión" / "Welcome Back"
    - Subtítulo: Instrucción amigable.
    - **Alertas**: Banner (Info/Error/Success) para status (ej. "Esperando confirmación de QuickBooks").
    - **Formulario**:
      - `Input`: Correo Electrónico (Placeholder, icono opcional).
      - `Input`: Contraseña (con botón tipo ojito para revelar password).
      - Opciones en fila: `Checkbox` "Recordar contraseña" (izq) y `Link` "¿Olvidaste tu contraseña?" (der).
      - `Botón Principal`: "Entrar". Debe tener estado `loading` (spinner) y `disabled`.
  - **Footer**: `Link` de soporte o de registro (si aplica).

---

## Flujo 2: Dashboard y Layout Principal

**Path:** `/dashboard/*`
**Objetivo**: Contenedor principal para usuarios autenticados.

- **Layout**: Sidebar a la izquierda (Fixed), Topbar superior, y Contenido principal en el centro (Fluid con padding).
- **Sidebar (MenuAside):**
  - Diseño colapsable (íconos solamente) o expandido (ícono + texto).
  - Opciones de menú: Dashboard, Documentos, Órdenes de Trabajo, Inspecciones, Clientes, Configuración.
  - Footer de Sidebar: Información del usuario activo (Avatar + Nombre + Rol) y botón rojo o gris de "Cerrar sesión".
- **Topbar:**
  - Botón hamburguesa (para mobile) para togglear el Sidebar.
  - Breadcrumbs para la navegación.
  - Zona derecha: Notificaciones (ícono campanita con badge), Selector de Idioma.
- **Contenido Central**:
  - Fondo gris claro.
  - Contenedor para inyectar los children de las páginas.

---

## Flujo 3: Work Orders (Órdenes de Trabajo)

**Path:** `/dashboard/documents/work-orders`
**Objetivo**: Visualización y gestión del módulo principal.

- **Encabezado de Vista**:
  - `H2` Título de la sección.
  - `Botón Primario` (Esquina superior derecha): "+ Crear Nueva Orden".
- **Filtros y Búsqueda (Barra de herramientas):**
  - `Input Búsqueda`: Buscar por ID de orden o Cliente.
  - `Selects`: Filtrar por Status (Pendiente, En Progreso, Completado).
  - `DatePicker`: Rango de fechas.
- **Vista Principal (Data Table / Tabla Compleja):**
  - Encabezados con opción de ordenamiento (Sort).
  - Columnas: ID Orden, Cliente, Fecha Creación, Status (uso de badges de colores: Verde para completado, Amarillo progreso, Gris pendiente), Acciones.
  - **Acciones (en cada fila)**: Íconos para "Ver Detalles", "Editar", "Eliminar".
- **Paginación**: Al fondo de la tabla.

---

## Flujo 4: Modal Crear/Editar Orden de Trabajo (Formulario Complejo)

**Acción**: Al presionar "+ Crear Nueva Orden" o "Editar".
**Objetivo**: Formulario step-by-step o largo.

- **Layout**: Modal Overlay (Fondo semi-transparente oscuro) y Contenedor central blanco, o bien un "Slide-over" (Panel lateral derecho).
- **Componentes**:
  - Título y Botón cerrar (X).
  - Grid de Inputs 2x2.
    - Cliente (Select Autocomplete).
    - Fecha Estimada (Date Picker).
    - Notas (Textarea).
    - Elementos (Repetidor o tabla embebida donde se añaden items).
  - **Footer del Formulario**: Botón "Cancelar" (Ghost/Outline) y Botón "Guardar" (Primario).

---

## Guía de Interacciones para Google Stitch

- **Validaciones Visuales**: Todos los inputs deben tener variante `error` (borde rojo y texto de soporte debajo) manejado vía React Hook Form.
- **Esqueletos (Skeletons)**: Para cargas de tablas e información, se debe usar un diseño de "Skeleton loading" para evitar parpadeos.
- **Responsivo**: El Sidebar se esconde en pantallas `< 768px` y aparece como menú Off-Canvas. Los modales deben ser `bottom-sheet` o modales full screen en mobile.

*(Nota para la IA de Stitch: Utilizar este documento para generar iterativamente los componentes React siguiendo estrictamente este flujo de UI).*
