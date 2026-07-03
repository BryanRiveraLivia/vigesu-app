# 📖 LA BIBLIA DE VIGESU APP
## Documentación Técnica Arquitectónica y Mapeo Funcional Paso a Paso de Cada Módulo y Menú

---

## 📑 ÍNDICE GENERAL
1. [Introducción y Filosofía del Sistema](#1-introducción-y-filosofía-del-sistema)
2. [Capítulo 1: Autenticación, Seguridad y Control de Sesión](#capítulo-1-autenticación-seguridad-y-control-de-sesión)
3. [Capítulo 2: Mapeo Exhaustivo y Flujo Paso a Paso de Cada Menú](#capítulo-2-mapeo-exhaustivo-y-flujo-paso-a-paso-de-cada-menú)
   - [Módulo 0: Panel Principal (Dashboard)](#0-panel-principal-dashboard)
   - [Módulo 1: Documentos (Operaciones en Terreno)](#1-módulo-documentos-operaciones-en-terreno)
     - [1.1. Órdenes de Trabajo (`/dashboard/documents/work-orders`)](#11-órdenes-de-trabajo)
     - [1.2. Inspecciones Técnicas (`/dashboard/documents/inspections`) — Flujo Wizard Multi-Paso](#12-inspecciones-técnicas-wizard-multi-paso)
   - [Módulo 2: Catálogos (Administración - Solo Rol 1)](#2-módulo-catálogos-administración)
     - [2.1. Configuración de Inspección (`/dashboard/catalogs/inspection-configuration`)](#21-configuración-de-inspección)
     - [2.2. Grupos de Inspección (`/dashboard/catalogs/groups`)](#22-grupos-de-inspección)
     - [2.3. Gestión de Usuarios y Roles (`/dashboard/catalogs/users`)](#23-gestión-de-usuarios-y-roles)
     - [2.4. Catálogo de Servicios y Repuestos (`/dashboard/catalogs/services`)](#24-catálogo-de-servicios-y-repuestos)
   - [Módulo 3: Configuración del Sistema](#3-módulo-configuración)
     - [3.1. Tema IC / Formatos de Reporte (`/dashboard/configurations/ic-theme`)](#31-tema-ic--formatos-de-reporte)
4. [Capítulo 3: Gestión de Estado Global (Zustand Stores & i18n)](#capítulo-3-gestión-de-estado-global-zustand--i18n)
5. [Capítulo 4: Motor de Renderizado PDF e Integraciones Externas](#capítulo-4-motor-de-renderizado-pdf-e-integraciones-externas)
6. [Capítulo 5: Guía para Futuras Ampliaciones y Tareas de Desarrollo](#capítulo-5-guía-para-futuras-ampliaciones)

---

## 1. INTRODUCCIÓN Y FILOSOFÍA DEL SISTEMA

**Vigesu App** es una plataforma moderna construida sobre **Next.js 16 (App Router)** con **React 19** y **TypeScript**, cuyo propósito core es la digitalización del ciclo de vida de mantenimiento mecánico, inspección preventiva de maquinaria pesada y emisión de órdenes de trabajo con validez técnica y contable.

El diseño del software obedece a tres pilares fundamentales:
1. **Ergonomía Operativa en Terreno**: Los técnicos y mecánicos acceden desde tablets o dispositivos móviles en ambientes industriales; por ello, los flujos complejos se dividen en **Wizards paso a paso**, con áreas de toque amplias (DaisyUI/Tailwind) y captura de firmas/fotos nativas en navegador.
2. **Seguridad y Trazabilidad por Roles**: Estricta separación entre el personal administrativo (Rol 1) y el personal técnico en taller (Rol 2+).
3. **Sincronización Híbrida**: Integración con plataformas financieras estadounidenses (QuickBooks) y emisión automatizada de certificados PDF para clientes.

---

## CAPÍTULO 1: AUTENTICACIÓN, SEGURIDAD Y CONTROL DE SESIÓN

El control de acceso en Vigesu es una arquitectura multicapa que combina middleware en el servidor de Next.js y centinelas reactivos en el cliente.

```
[ Cliente / Navegador ] 
      │
      ├── (Solicitud de Ruta /es/dashboard/...)
      ▼
[ middleware.ts ] ──(Verifica Token en Cookies)──► ¿Token Válido? ──No──► [ Redirección a Login / ]
      │                                                  │
     Sí                                                 Sí (Inyecta Locale i18n)
      ▼                                                  ▼
[ DashboardLayout ] ──► Inicia [ SessionGuard.tsx ] ──► Monitorea Expiración en Tiempo Real
```

### 1.1. Middleware de Rutas (`middleware.ts`)
* **Función**: Es la primera barrera de defensa. Intercepta todas las peticiones entrantes.
* **Manejo de Localización (i18n)**: Aplica `next-intl/middleware` para asegurar que cada ruta posea un prefijo de idioma válido (`/es/...`, `/en/...`).
* **Protección de Rutas**: Verifica la presencia de la cookie de autenticación. Si un usuario intenta ingresar a `/dashboard/...` sin credenciales o con un token expirado, es redirigido inmediatamente al home (`/`).

### 1.2. Centinela de Sesión (`SessionGuard.tsx` y `useSessionValidator`)
* **Función**: Un componente invisible montado en el layout raíz que evalúa proactivamente la salud del token JWT.
* **Comportamiento**: 
  * Descodifica el token en el cliente para leer el `exp` (timestamp de expiración).
  * Si detecta inactividad o que la expiración del token es inminente, emite alertas o ejecuta el cierre de sesión automático (`useAuthStore.getState().logout()`), limpiando el estado de Zustand, purgando cookies y redirigiendo al login.

---

## CAPÍTULO 2: MAPEO EXHAUSTIVO Y FLUJO PASO A PASO DE CADA MENÚ

A continuación se detalla el funcionamiento exacto, archivo por archivo y paso por paso, de cada uno de los menús de la aplicación. Esta es la sección crítica para comprender los flujos largos y multi-paso.

---

### 0. PANEL PRINCIPAL (DASHBOARD)
* **Ruta**: `/dashboard`
* **Ubicación en Código**: `src/app/[locale]/dashboard/` y `MenuAside.tsx`.
* **Funcionamiento**:
  1. Al iniciar sesión, el usuario ingresa al panel principal.
  2. El componente lateral (`MenuAside.tsx`) ejecuta dos llamadas asíncronas simultáneas vía servicios:
     * `getTotalWorkOrders()`: Consulta al API el conteo total de órdenes activas o pendientes.
     * `getInspections({ PageNumber: 1, PageSize: 10 })`: Obtiene el conteo total (`totalCount`) de inspecciones registradas.
  3. Muestra los indicadores en formato de "píldoras informativas" con indicadores de carga (`Loading.tsx`) mientras se resuelve la promesa.
  4. Adapta el menú de navegación lateral filtrando los enlaces disponibles según el `rol` almacenado en el store `useAuthUser`.

---

### 1. MÓDULO: DOCUMENTOS (OPERACIONES EN TERRENO)

---

#### 1.1. ÓRDENES DE TRABAJO
* **Ruta**: `/dashboard/documents/work-orders`
* **Directorio Core**: `src/features/orders/`

Este es uno de los módulos más densos y vitales del sistema. Permite la creación, edición, impresión y sincronización contable de trabajos mecánicos.

##### 🔹 PASO 1: Listado, Filtrado y Búsqueda (`work-orders/page.tsx` & `TableList.tsx`)
1. El usuario visualiza la tabla principal de órdenes existentes.
2. **Panel de Búsqueda Avanzada**: Permite filtrar la grilla introduciendo criterios como:
   * **Cliente** (autocompletado/select).
   * **Estado de Orden** (Pendiente, En Proceso, Completado, Facturado).
   * **Nro. de Orden de Trabajo** (# OC / Work Order).
   * **Empleado / Técnico Asignado**.
   * **Fecha de Creación** (rango o fecha específica).
3. **Acciones de Cabecera**:
   * **Botón "Sincronizar Quickbook"**: Dispara una llamada al backend para reconciliar los datos financieros y facturas en QuickBooks (`toast.msj.14` o `toast.msj.22`).
   * **Botón "Nuevo"**: Abre el entorno de creación de una nueva orden de trabajo.

##### 🔹 PASO 2: Cabecera de Nueva Orden / Edición (`CreateOrder.tsx`)
Cuando el usuario inicia una nueva orden (o edita una existente en `edit-order`), se despliega un formulario interactivo controlado por **React Hook Form** y **Zod**.
1. **Selección de Cliente y Ubicación**: Se elige el cliente del catálogo maestro y se especifica el "Lugar de reparación" (Taller en sede o Terreno/Field Service).
2. **Identificación de la Maquinaria/Equipo**:
   * **Equipo #**: Código interno o número económico de la máquina.
   * **Placa #**: Matrícula o identificación vehicular.
   * **VIN #**: Número de serie del chasis/motor.
   * **OC #**: Número de Orden de Compra asociada del cliente.
3. **Asignación de Personal y Tiempos**:
   * Se selecciona el **Nombre del Mecánico** responsable.
   * Se registra la **Fecha de reparación** utilizando selectores de fecha (`cally` / `react-day-picker`).
   * Se capturan la **Hora de inicio del servicio** y **Hora de fin del servicio** para el cálculo de horas-hombre.

##### 🔹 PASO 3: Grilla Dinámica de Servicios y Repuestos (The Work Grid)
En el corazón del formulario de órdenes se encuentra una tabla dinámica donde se agregan las líneas de facturación y trabajo:
1. **Agregar Fila (`btnNew`)**: El técnico puede insertar un número ilimitado de filas.
2. **Mapeo por Línea**:
   * **Servicio / Repuestos**: Selector autocomportable vinculado al catálogo maestro (`catalogs/services`). Al elegir un servicio, hereda propiedades como descripción base y tipo.
   * **Cantidad**: Horas invertidas o número de piezas utilizadas.
   * **Descripción del trabajo**: Campo de texto libre ("Escribir descripción del trabajo...") para detallar los procedimientos técnicos realizados en ese componente.
3. **Mediciones Técnicas**:
   * **Profundidad de la banda de llantas (Tire Tread Depth)**: Registro numérico crucial para la seguridad de maquinaria pesada.
   * **Observación General**: Campo de notas adicionales del mecánico o advertencias para el cliente.
4. **Eliminación de Filas**: Botón de borrado para remover líneas erróneas antes de guardar.

##### 🔹 PASO 4: Evidencias Fotográficas (`ImageUploader.tsx`)
1. El técnico accede a la sección de adjuntar archivos ("Adjuntar fotos o tomar imágenes").
2. Utilizando **`react-dropzone`**, el sistema permite:
   * En escritorio: Arrastrar y soltar archivos de imagen desde la PC.
   * En dispositivos móviles/tablets: **Abrir directamente la cámara del dispositivo** ("Haga clic para subir o tomar una foto con su cámara") para tomar fotos del daño antes y después de la reparación.
3. Las imágenes se procesan, se previsualizan en miniaturas y se preparan como payload en base64 o `FormData` para ser enviadas al backend.

##### 🔹 PASO 5: Firma Digital (`react-signature-canvas`)
1. Ninguna orden de trabajo puede cerrarse satisfactoriamente sin validez legal/técnica (`toast.msj.9`: "La firma es obligatoria").
2. Se despliega un lienzo interactivo (*canvas*) donde el cliente o supervisor dibuja su firma autógrafa con el dedo (en pantalla táctil) o con el mouse.
3. Botón de limpieza para volver a firmar si el trazo no es satisfactorio.
4. Al guardar, el canvas convierte la firma en una imagen PNG base64 transparente que se incrusta de forma inmutable en la orden.

##### 🔹 PASO 6: Emisión, PDF y Sincronización Contable
1. Al pulsar **Guardar**, el sistema valida con Zod. Si es exitoso, emite `toast.msj.16` ("¡Orden de trabajo creada con éxito!").
2. **Vista de Impresión / Emisión (`print`)**:
   * Opción **"Habilitar / Deshabilitar edición"**: Permite bloquear la orden para evitar modificaciones accidentales antes de imprimir.
   * **"Imprimir orden" / "Descargar PDF"**: Invoca al motor de generación (`orders-pdf/OrdersPdf1.tsx`), convirtiendo el HTML y las imágenes adjuntas en un documento PDF de alta fidelidad.
   * **Envío a QuickBooks**: Si el usuario lo requiere, el PDF generado y el desglose de costos se transmiten al API de QuickBooks (`toast.msj.15`: "PDF enviado correctamente a QuickBooks").

---

#### 1.2. INSPECCIONES TÉCNICAS (WIZARD MULTI-PASO)
* **Ruta**: `/dashboard/documents/inspections`
* **Directorio Core**: `src/features/orders/inspections/` y `src/features/inspections/`
* **Gestor de Estado**: `useInspectionFullStore` (Zustand)

El módulo de inspecciones es el flujo más estructurado del proyecto. Para evitar abrumar al técnico con un formulario de 100 preguntas, se implementó un **Wizard guiado de 4 pasos secuenciales**, donde el avance está controlado estrictamente por reglas de validación en Zustand.

```
[ PASO 0: Inicio ] ──► (Selecciona Cliente & Tipo de Configuración) ──► Inicia Store
                            │
                            ▼
[ PASO 1: Grupos ] ──► (Elige Grupo: ej. Sistema Hidráulico) ──► Habilita Paso 2
                            │
                            ▼
[ PASO 2: Ítems ]  ──► (Elige Pregunta: ej. Fuga de cilindros) ──► Habilita Paso 3
                            │
                            ▼
[ PASO 3: Evaluar ]──► (Responde Aprobado/Fallo + Modal Repuestos + Fotos) ──► Guarda
                            │
                            ▼
[ PASO 4: Cierre ] ──► (¿Todos los grupos listos?) ──► Genera PDF & Envía Correo
```

##### 🔹 PASO 0: Generador de Opciones y Cabecera (`GenerateStep0.tsx`)
1. Al ingresar a "Nuevo" desde el listado de inspecciones, se monta el componente de inicio.
2. El técnico debe definir el contexto general:
   * **Cliente**: Selector del cliente al que pertenece la maquinaria.
   * **Tipo de inspección (Configuración)**: Se selecciona la plantilla maestra creada en Catálogos (ej. "Inspección Preventiva Grúa 50 Ton", "Chequeo Diario Montacargas"). Al seleccionar la plantilla, el frontend solicita al backend toda la estructura de grupos y preguntas asociada a dicho ID.
   * **Seleccione una inspección existente**: Alternativamente, el técnico puede retomar una inspección en borrador que dejó incompleta en el turno anterior.
3. Al pulsar **"Completar y guardar inspección"**, el store `useInspectionFullStore` inicializa la matriz de respuestas y habilita el paso 1 en la barra de navegación del Wizard (`Wizard.tsx`).

##### 🔹 PASO 1: Selección de Grupo de Inspección (`GenerateStep1.tsx`)
1. La vista despliega tarjetas o listas representando los **Grupos** en los que se divide la maquinaria según la plantilla seleccionada (por ejemplo: *1. Cabina y Controles*, *2. Sistema de Frenos*, *3. Motor y Fluidos*, *4. Estructura y Chasis*).
2. Cada grupo muestra un indicador de progreso (ej. `0/10 preguntas completadas`).
3. El técnico hace clic sobre el grupo que desea auditar en ese momento. Al seleccionar un grupo, el store actualiza `completeStep1 = true` y cambia la vista automáticamente hacia el **Paso 2**.

##### 🔹 PASO 2: Selección de Pregunta / Ítem de Verificación (`GenerateStep2.tsx`)
1. Se listan todas las preguntas pertenecientes exclusivamente al grupo seleccionado en el Paso 1.
2. Cada pregunta muestra su estado actual (Sin responder, Aprobado, Fallo, No Aplica).
3. Si el usuario ya respondió todo el grupo, el sistema muestra una tarjeta de notificación especial: *"Has completado todas las preguntas. Clic aquí para ir al siguiente grupo"* (`step2.1_5`).
4. El técnico selecciona una pregunta específica para proceder a su evaluación minuciosa, activando `completeStep2 = true` y pasando al **Paso 3**.

##### 🔹 PASO 3: Evaluación del Ítem, Repuestos y Evidencias (`GenerateStep3.tsx` & `ModalUsingItem.tsx`)
Este es el paso de mayor granularidad técnica en el terreno:
1. **Lectura del Ítem**: Se muestra el título de la pregunta en gran tamaño (*"Pregunta: Estado de mangueras de alta presión"*).
2. **Selección de la Respuesta Final (`¿Cuál es la respuesta final?`)**:
   * El técnico dispone de botones de estado rápidos (ej. **Buen Estado / Aprobado**, **Deficiente / Fallo**, **No Aplica / N/A**).
   * Si el técnico intenta avanzar sin seleccionar un estado, el sistema bloquea la acción y emite `toast.msj.30` (*"Primero debe seleccionar la respuesta"*).
3. **Vinculación de Repuestos Utilizados (`ModalUsingItem.tsx`)**:
   * Si el ítem es inspeccionado y se detecta una falla que es reparada en el momento (o que requerirá un repuesto en la orden de trabajo), el técnico pulsa "Agregar ítem/repuesto".
   * Se abre `ModalUsingItem.tsx`, el cual busca en el catálogo de servicios/repuestos.
   * Se captura: **Ítem seleccionado**, **Cantidad utilizada** y notas de instalación.
   * Esto permite que la inspección preventiva alimente automáticamente futuras cotizaciones o salidas de inventario.
4. **Captura Fotográfica del Hallazgo**:
   * Mediante la zona de carga integrada (`react-dropzone`), se adjuntan fotos que evidencian el desgaste, rotura o fuga descubierta en ese punto exacto de la máquina.
5. **Guardado del Ítem**: Al pulsar **Guardar**, el store almacena la respuesta en memoria, marca la pregunta como completada con un icono verde, y devuelve al técnico al Paso 2 para continuar con la siguiente pregunta del grupo.

##### 🔹 PASO 4: Cierre, Resumen Final y Envío por Correo (`GenerateStep4.tsx` & `EmailConfirmationModal.tsx`)
1. Una vez que todos los ítems de todos los grupos están marcados, el Wizard desbloquea el estado final.
2. El sistema presenta un resumen de la inspección completada, resaltando las alertas o ítems que fallaron.
3. **Modal de Confirmación de Correo (`EmailConfirmationModal.tsx`)**:
   * Se solicita o confirma el correo electrónico del cliente y del supervisor de planta.
   * Al validar ("Ingrese un correo electrónico válido" - `toast.msj.25`), el sistema invoca la API de email basada en la librería **`resend`**, utilizando plantillas HTML preformateadas ubicadas en `emailTemplates/`.
   * Se dispara el envío del reporte ejecutivo con el certificado de inspección adjunto (`toast.msj.26`: "Correo enviado con éxito").
4. El registro queda consolidado en base de datos como una inspección cerrada (`toast.msj.5`: "¡Orden de inspección creada con éxito!").

---

### 2. MÓDULO: CATÁLOGOS (ADMINISTRACIÓN)
* **Acceso**: Restringido estrictamente a usuarios con `rol === 1` (Administradores / Supervisores).
* **Ubicación**: `src/app/[locale]/dashboard/catalogs/` y `src/features/inspections/`

Este módulo es el motor de configuración que alimenta los formularios y wizards operativos del Módulo 1.

#### 2.1. CONFIGURACIÓN DE INSPECCIÓN
* **Ruta**: `/dashboard/catalogs/inspection-configuration`
* **Directorio Feature**: `src/features/inspections/inspection-configuration/`
* **Funcionamiento**:
  1. Muestra el listado maestro de plantillas de inspección existentes, filtrables por Cliente, Estado y Nombre.
  2. **Creación de Plantilla (`create-inspection/CreateOrder.tsx`)**:
     * Permite al administrador crear una nueva estructura de inspección (ej. "Mantenimiento 1000 Horas - Excavadora CAT").
     * Se asigna el cliente dueño de la plantilla.
     * Se vinculan qué **Grupos** de revisión compondrán esta plantilla y en qué orden lógico deberán aparecerle al técnico durante el Wizard (Paso 0 y Paso 1 de Inspecciones).

#### 2.2. GRUPOS DE INSPECCIÓN
* **Ruta**: `/dashboard/catalogs/groups`
* **Directorio Feature**: `src/features/inspections/groups/`
* **Funcionamiento**:
  1. Gestión de los macro-componentes o partes de un equipo pesado (ej. *Motor*, *Transmisión*, *Sistema Eléctrico*, *Cabina*, *Chasis y Rodaje*).
  2. Cada grupo es creado, asignado a un cliente o estado, y posteriormente poblado con preguntas individuales en la base de datos. Cuando el técnico navega en el Paso 1 de Inspecciones, lo que ve renderizado es exactamente el conjunto de registros administrados en este menú.

#### 2.3. GESTIÓN DE USUARIOS Y ROLES
* **Ruta**: `/dashboard/catalogs/users`
* **Directorio Feature**: `src/features/inspections/users/` (`UserTable.tsx`, carpetas `create/` y `edit/`)
* **Funcionamiento**:
  1. **Grilla de Personal**: Muestra todos los usuarios registrados con columnas de Usuario (`username`), Nombre del Empleado (`employee_name`), y Rol (`role`).
  2. **Creación y Edición de Usuarios**:
     * Formulario con validación estricta (`toast.msj.11`: "Todos los campos son obligatorios").
     * Selección del Empleado de la lista maestra de recursos humanos (`toast.msj.8`).
     * Asignación de **Rol de Seguridad**:
       * `Rol 1`: Otorga privilegios de Administrador (desbloquea menú Catálogos y ediciones destructivas).
       * `Rol 2+`: Otorga privilegios de Operador/Técnico.
     * **Asignación de Color Identificatorio**: El sistema permite categorizar a los usuarios o equipos de trabajo mediante una paleta de colores curada y elegante: **Carmesí (Crimson)**, **Ámbar (Amber)**, o **Terciopelo (Velvet)**. Estos colores se utilizan posteriormente en avatares y etiquetas en el dashboard.

#### 2.4. CATÁLOGO DE SERVICIOS Y REPUESTOS
* **Ruta**: `/dashboard/catalogs/services`
* **Directorio Feature**: `src/app/[locale]/dashboard/catalogs/services/`
* **Funcionamiento**:
  1. Mantiene la base de datos maestra de los servicios que presta el taller (ej. *Cambio de Aceite Hidráulico*, *Diagnóstico de Scanner*, *Overhaul de Motor*) y los repuestos físicos consumibles.
  2. Cada servicio está tipificado, asociado a un cliente (si es un contrato especializado) o de uso general, y posee un estado de actividad.
  3. Al igual que los usuarios, los servicios pueden etiquetarse visualmente con los colores del sistema (**Carmesí**, **Ámbar**, **Terciopelo**) para clasificar su nivel de complejidad o tipo de mantenimiento (Correctivo, Preventivo, Predictivo).
  4. **Conexión Operativa**: Este es el exacto listado que alimenta los autocompletados en la grilla dinámica de Órdenes de Trabajo (Paso 3) y en el modal de partes utilizadas de Inspecciones (`ModalUsingItem.tsx`).

---

### 3. MÓDULO: CONFIGURACIÓN
* **Ubicación**: `src/app/[locale]/dashboard/configurations/`

#### 3.1. TEMA IC / FORMATOS DE REPORTE (`ic-theme`)
* **Ruta**: `/dashboard/configurations/ic-theme`
* **Directorio Feature**: `src/features/orders/orders-theme/`
* **Funcionamiento**:
  1. Administra el diseño visual y los identificadores de plantilla utilizados durante la impresión o exportación de documentos.
  2. Muestra la advertencia del sistema (`info_alert`): *"Esta es una lista de los formatos de orden disponibles. Si necesita agregar un nuevo formato, esto debe ser consultado con el desarrollador, ya que todos los datos deben ser configurados y mapeados"*.
  3. Permite previsualizar cómo se renderizarán los encabezados, logotipos, firmas y grillas en los reportes PDF finales de las órdenes de trabajo según el cliente o contrato.

---

## CAPÍTULO 3: GESTIÓN DE ESTADO GLOBAL (ZUSTAND & i18n)

Para evitar el "prop drilling" (pasar propiedades a través de múltiples niveles de componentes) y garantizar una experiencia ultra rápida sin recargas de página, el proyecto utiliza **Zustand** divido en stores atómicos especializados en `src/shared/stores/` y `src/features/orders/store/`.

### 3.1. Arquitectura de Stores en Zustand
1. **`useAuthStore`**:
   * Almacena el token JWT de sesión, el estado de autenticación y los métodos de `login()` y `logout()`.
   * Sincronizado con cookies para permitir que Next.js SSR y el `middleware.ts` puedan leer la sesión antes de renderizar el HTML.
2. **`useAuthUser`**:
   * Mantiene el perfil del usuario activo en memoria: `userName`, `employeeName`, `rol`.
   * Es consumido instántaneamente por `MenuAside.tsx` para mostrar el avatar con iniciales (`getInitials`) y ocultar/mostrar secciones de administración.
3. **`useSidebarStore`**:
   * Controla la responsividad de la interfaz. Mantiene un booleano `isSidebarOpen` y acciones `openSidebar()`, `closeSidebar()`, `toggleSidebar()`.
   * Un *listener* de media query en `DashboardLayout` evalúa si el ancho de pantalla es superior a 1024px (`lg`), abriendo el sidebar automáticamente en escritorio y contrayéndolo en móviles.
4. **`useLoadingStore`**:
   * Store global para controlar la capa de superposición (*overlay*) de carga. Cuando un servicio asíncrono pesado (como generar un PDF o enviar datos a QuickBooks) se ejecuta, activa `isLoading = true` con un label personalizado, bloqueando interacciones accidentales de UI.
5. **`useInspectionFullStore` (El Cerebro del Wizard)**:
   * Almacena todo el estado temporal de una inspección en curso.
   * Mantiene las banderas booleanas de validación de pasos: `completeStep1`, `completeStep2`, `completeStep3`.
   * Expone el método `setStepWizard(n)`, el cual impide que un usuario salte al Paso 3 si la regla de negocio del Paso 1 no se ha cumplido satisfactoriamente.

### 3.2. Internacionalización con `next-intl`
* El sistema es bilingüe nativo. En el directorio `messages/`, los archivos `es.json` y `en.json` contienen un árbol idéntico de claves JSON.
* Las vistas no contienen texto estático en código duro (*hardcoded*). En su lugar, utilizan el hook de traducción:
  ```tsx
  const t = useTranslations("workorders.new");
  return <label>{t("11")}</label>; // Renderiza: "Servicio/Repuestos" en ES, o "Service/Parts" en EN
  ```
* El cambio de idioma se gestiona mediante `LanguageSwitcher.tsx`, el cual reemplaza el prefijo del *pathname* en la URL (`/es/dashboard/...` ➔ `/en/dashboard/...`), disparando un re-renderizado instantáneo con los nuevos textos sin perder el estado de la sesión.

---

## CAPÍTULO 4: MOTOR DE RENDERIZADO PDF E INTEGRACIONES EXTERNAS

Uno de los mayores valores arquitectónicos de Vigesu App es su capacidad para producir documentos de ingeniería y legales directamente desde la web.

### 4.1. Pipeline de Generación de PDF
El proyecto utiliza una estrategia dual de renderizado:
1. **Renderizado en Cliente (`jspdf`, `html2canvas-pro`, `react-to-print`)**:
   * Utilizado para previsualizaciones rápidas en el navegador y para imprimir directamente a la impresora local del taller.
   * Convierte el nodo DOM del reporte (ej. `OrdersPdf1.tsx`) en un canvas de alta resolución y lo proyecta en un documento vectorial PDF, incrustando las firmas en base64 y las fotografías de evidencia con compresión optimizada.
2. **Renderizado en Servidor / SSR (`@react-pdf/renderer`, `puppeteer`, `sparticuz/chromium`)**:
   * Cuando se requiere enviar un reporte por correo electrónico o archivarlo en el backend, el servidor de Next.js ejecuta una instancia headless de Chromium (`puppeteer-core`).
   * Navega internamente a la vista de impresión en un ambiente aislado, compila el documento y genera un buffer PDF en milisegundos, garantizando que el documento sea idéntico en cualquier dispositivo sin depender del navegador del móvil del técnico.

### 4.2. Integración Financiera: QuickBooks
* **Objetivo**: Conectar el trabajo técnico de taller con la contabilidad sin doble digitación.
* **Flujo**:
  1. Al emitir una orden de trabajo completa (Paso 6) o al pulsar "Sincronizar Quickbook" en los listados, el frontend compila el payload JSON con los ítems del catálogo (`services`), horas trabajadas y repuestos consumidos.
  2. Envía esta carga al endpoint transaccional del backend.
  3. El backend reconcilia los IDs de los servicios de Vigesu con los ítems de inventario de QuickBooks vía API OAuth2, generando automáticamente la factura (*Invoice*) o estimación en la contabilidad del cliente.

### 4.3. Motor de Notificaciones por Correo (`resend`)
* La librería `resend` se encarga de la entrega transaccional garantizada.
* Las plantillas de correo (`src/features/orders/inspections/components/emailTemplates/`) son componentes de React estandarizados y maquetados con estilos en línea para ser compatibles con clientes de correo restrictivos como Microsoft Outlook o Gmail empresarial.

---

## CAPÍTULO 5: GUÍA PARA FUTURAS AMPLIACIONES

Al asumir nuevas tareas de programación o mantenimiento sobre **Vigesu App**, se deben respetar los siguientes patrones de ingeniería establecidos por el proyecto:

### 5.1. Para Agregar una Nueva Ruta o Menú en el Dashboard
1. **Traducciones Primero**: Antes de crear el archivo, agrega los identificadores y títulos del menú en **ambos** archivos de idioma (`messages/es.json` y `messages/en.json`) dentro de la clave `"aside"`.
2. **Actualizar el Aside**: Edita `src/shared/components/shared/MenuAside.tsx`. Agrega el nuevo objeto de ruta en el arreglo correspondiente (`ordersLinks`, `inspectionsLinks` o `configurationLinks`), asegurando asociarle un icono coherente de la librería `react-icons/sl`.
3. **Crear la Vista Localizada**: Crea el directorio bajo `src/app/[locale]/dashboard/[nombre-del-modulo]/page.tsx`, envolviendo el texto en el hook `useTranslations()`.
4. **Control de Acceso (RBAC)**: Si el menú es exclusivo de administración, asegúrate de condicionar su inclusión en el menú y envolver el `page.tsx` en una validación que verifique que `rol === 1`, redirigiendo si un técnico intenta acceder por URL directa.

### 5.2. Para Modificar o Añadir Pasos al Wizard de Inspección
1. **Extender Zustand**: Toda nueva variable de estado o lógica de transición entre pasos debe registrarse en la interfaz y el store de `src/features/orders/store/inspection/inspectionFullStore.ts`. **No uses estado local (`useState`) en componentes individuales para datos que el Wizard necesita recordar entre pasos**.
2. **Componentes Aislados**: Crea un componente modular `GenerateStepX.tsx` en `src/features/orders/inspections/components/`.
3. **Barra de Progreso**: Actualiza `Wizard.tsx` añadiendo el nuevo `<li className="step">` vinculado a la condición de completado del store para mantener la coherencia visual.

### 5.3. Buenas Prácticas de Estilos (Tailwind & DaisyUI)
* **No utilices colores hexadecimales quemados** en nuevas vistas a menos que sea un estilo de marca estricto. Utiliza las clases semánticas del tema oscuro de DaisyUI/Tailwind (ej. `bg-neutral`, `text-neutral-content`, `border-[#ffffff17]`).
* Recuerda que los botones operacionales en terreno deben mantener un `min-h-[48px]` y `px-4` para facilitar el toque con dedos o guantes en pantallas táctiles industriales.

---
*Documentación arquitectónica elaborada por Antigravity para el equipo de ingeniería de Vigesu App.*
