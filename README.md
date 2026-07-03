# 🛠️ Vigesu App — Sistema de Gestión de Órdenes de Trabajo e Inspecciones Técnicas

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5.0-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5.0-orange?style=for-the-badge)

**Vigesu App** es una plataforma empresarial moderna y altamente escalable desarrollada para la administración integral, control operativo y trazabilidad de **Órdenes de Trabajo Mecánico/Mantenimiento** e **Inspecciones Técnicas de Maquinaria y Equipos**.

Diseñada bajo estándares modernos de desarrollo con **Next.js 16 (App Router)** y **React 19**, la aplicación cuenta con un diseño fluido, soporte internacional (multi-idioma) y capacidades avanzadas de captura de datos en terreno, incluyendo adjuntado de evidencias fotográficas, firmas digitales en pantalla, generación y renderizado de reportes PDF, y sincronización con sistemas contables externos como **QuickBooks**.

---

## Documentación Principal del Proyecto

Para mantener el estándar de calidad y referencia arquitectónica, consulta los siguientes documentos:

1. **[Bible (BIBLE.md)](./BIBLE.md)** / **[bible.md](./bible.md)**
   Contiene la arquitectura del sistema, principios de diseño, manejo de estado (Zustand), y lineamientos de tipado estricto. Es la fuente de la verdad para decisiones arquitectónicas.
2. **[Guide (guide.md)](./guide.md)**
   Guía paso a paso para el desarrollo diario. Contiene convenciones de código, cómo crear nuevas features, manejo de formulaciones e internacionalización.
3. **[Design (design.md)](./design.md)**
   Documento base con todo el flujo de vistas, requisitos de UX/UI y diseño.

---

## ✨ Características Principales

* 🔐 **Seguridad y Control de Sesiones**: Autenticación mediante JWT, protección de rutas con `middleware.ts` y monitoreo proactivo de expiración de sesión (`SessionGuard`).
* 🌍 **Multi-idioma (i18n)**: Soporte completo para Español e Inglés mediante `next-intl`, enrutamiento localizado (`/[locale]/...`) y formato adaptado por región.
* 📋 **Órdenes de Trabajo Completas**: Gestión de cabecera de cliente, datos de equipo (VIN, Placa, # Equipo, Horas de servicio), grilla dinámica de servicios/repuestos, notas de taller y captura de firma digital con `react-signature-canvas`.
* 🔍 **Inspecciones Técnicas Multi-Paso (Wizard Inteligente)**: Flujo guiado en 4 etapas por categorías y grupos de verificación, asociación de repuestos/partes utilizadas por cada hallazgo (`ModalUsingItem`) y adjuntado de evidencia fotográfica (`react-dropzone`).
* 📊 **Catálogos Dinámicos (Solo Administración)**: Mantenimiento modular de configuraciones de inspección, grupos de chequeo, usuarios, roles del sistema y catálogo de repuestos/servicios con codificación de colores.
* 📄 **Generación de Reportes PDF y Sincronización**: Motores de exportación y renderizado de documentos mediante `@react-pdf/renderer`, `jspdf`, `html2canvas` y `puppeteer` en servidor. Integración para envío por correo electrónico con `resend` y sincronización con QuickBooks.
* 🎨 **UI/UX Premium y Responsiva**: Interfaz oscura/moderna ("Dark Mode / Sleek Design") construida con **Tailwind CSS v4** y **DaisyUI v5**, optimizada tanto para estaciones de trabajo de escritorio como para tablets y dispositivos móviles en taller.

---

## 🏗️ Arquitectura y Stack Tecnológico

El proyecto sigue una arquitectura **Feature-Sliced / Modular**, separando claramente las vistas de enrutamiento (`src/app`), la lógica de negocio por módulos (`src/features`) y los componentes/utilidades transversales (`src/core`, `src/presentation`).

| Componente / Capa | Tecnología / Librería | Descripción |
| :--- | :--- | :--- |
| **Core Framework** | `Next.js 16.0.10` | App Router, Server Components, Turbopack para desarrollo ultrarrápido. |
| **Librería UI** | `React 19.2.3` & `DOM 19` | Última versión de React con tipado estricto en TypeScript 5.8. |
| **Estilos y Diseño** | `Tailwind CSS v4` + `DaisyUI v5` | Sistema de diseño utilitario, temas personalizables y variables CSS/Sass. |
| **Gestión de Estado** | `Zustand 5.0.5` | Stores atómicos para Autenticación, Sidebar, Wizards de Inspección y Loaders. |
| **Formularios & Validación**| `React Hook Form` + `Zod` | Manejo óptimo de formularios complejos y validación esquemática estricta. |
| **Internacionalización** | `next-intl 4.5.8` | Gestión de traducciones e i18n en servidor y cliente (`messages/es.json`). |
| **PDF & Impresión** | `jspdf`, `html2canvas-pro`, `react-to-print` | Exportación e impresión de reportes técnicos y órdenes de trabajo en cliente/servidor. |
| **Captura y Multimedia** | `react-signature-canvas`, `react-dropzone` | Firma autógrafa digital en pantalla y subida de fotografías en terreno. |
| **Integraciones API** | `axios`, `resend`, `cookies-next` | Cliente HTTP, servicio transaccional de correos y persistencia de tokens. |

---

## 🚀 Guía de Instalación y Puesta en Marcha

### 1. Requisitos Prerequisitos
* **Node.js**: Versión 20.x o superior recomendada.
* **Gestor de Paquetes**: `npm`, `pnpm` o `yarn`.

### 2. Instalación de Dependencias
Clona el repositorio e instala los paquetes necesarios:
```bash
git clone https://github.com/BryanRiveraLivia/vigesu-app.git
cd vigesu-app
npm install
```

### 3. Servidor de Desarrollo con Turbopack
Inicia el entorno de desarrollo ultrarrápido (configurado por defecto en el puerto `3001`):
```bash
npm run dev
```
Accede a la aplicación en tu navegador web: **[http://localhost:3001](http://localhost:3001)**.

---

## 📜 Scripts Disponibles

* `npm run dev`: Ejecuta la aplicación en modo desarrollo con **Turbopack** habilitado (`-p 3001`).
* `npm run build`: Genera el bundle de producción optimizado para Next.js.
* `npm run build:clean`: Limpia la caché local (`.next`) y compila el proyecto desde cero.
* `npm run start`: Inicia el servidor de producción local después de compilar.
* `npm run lint`: Ejecuta el linter de Next.js para detectar errores de estilo o sintaxis.
* `npm run lint:fix`: Corrige automáticamente problemas de formato con ESLint y extensiones `.ts,.tsx`.
* `npm run find:dead` / `npm run dead:check`: Analiza el proyecto en busca de código y exportaciones no utilizadas mediante `ts-prune`.

---

## 👥 Control de Acceso por Roles (RBAC)

El sistema adapta dinámicamente la navegación (`MenuAside`) y los permisos de edición según el rol del usuario autenticado:
1. **Rol 1 (Administrador / Supervisor)**: Acceso total y administración de catálogos.
2. **Rol 2+ (Técnico / Mecánico / Empleado en Terreno)**: Enfoque operativo en terreno y diligenciamiento de órdenes/inspecciones.
