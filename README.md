# Vigesu Web App

Este es el proyecto frontend principal de **Vigesu**, desarrollado con el stack moderno de Next.js (App Router), React 19, Tailwind CSS, y Zustand.

## Documentación Principal del Proyecto

Para mantener el estándar de calidad, hemos separado la documentación en tres archivos fundamentales que TODO desarrollador debe leer:

1. **[Bible (bible.md)](./bible.md)**
   Contiene la arquitectura del sistema, principios de diseño, manejo de estado (Zustand), y lineamientos de tipado estricto. Es la fuente de la verdad para decisiones arquitectónicas.
2. **[Guide (guide.md)](./guide.md)**
   Guía paso a paso para el desarrollo diario. Contiene convenciones de código, cómo crear nuevas features, manejo de formularios (React Hook Form + Zod), e internacionalización.
3. **[Design (design.md)](./design.md)**
   Documento base con todo el flujo de vistas, requisitos de UX/UI y diseño pensado para generación de interfaces (Google Stitch).

## Stack Tecnológico

- **Framework**: Next.js (App Router) v15+
- **Lenguaje**: TypeScript (Tipado Estricto)
- **Estilos**: Tailwind CSS v4, SCSS
- **Estado Global**: Zustand
- **Validación de Datos**: Zod
- **Formularios**: React Hook Form
- **Internacionalización**: next-intl
- **Peticiones HTTP**: Axios

## Instalación y Desarrollo

Instalar dependencias:
```bash
npm install
```

Levantar servidor en desarrollo:
```bash
npm run dev
```

Abra [http://localhost:3001](http://localhost:3001) para ver la aplicación.

## Comandos Útiles

- `npm run build`: Compila para producción.
- `npm run lint`: Corre el linter.
- `npm run lint:fix`: Corrige los errores del linter automáticamente.
- `npm run find:dead`: Encuentra código no utilizado con `ts-prune`.

## Despliegue

La plataforma está configurada para el despliegue automático mediante Netlify. Usar `npm run build:staging` o `npm run build:prod` si es necesario.
