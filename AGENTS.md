# Reglas Generales para Agentes (Antigravity & Otros)

Este proyecto tiene reglas de arquitectura estrictas que todos los asistentes y agentes de inteligencia artificial deben seguir al pie de la letra antes de escribir o modificar código.

## Project Agent Skills

Los skills especializados y adaptados para este proyecto viven en la carpeta: `.agents/skills/`.
Antes de realizar cualquier acción compleja, los agentes deben revisar si existe un skill relevante en ese directorio.

Las reglas de este proyecto SIEMPRE tienen prioridad sobre cualquier skill externo o genérico.

## Restricciones Obligatorias

- **Framework**: El proyecto utiliza **Next.js 16.2.9**.
- **APIs Internas**: Todas las rutas de API internas DEBEN vivir exclusivamente dentro de la carpeta `/api`. No se permite crear endpoints dispersos fuera de este patrón.
- **TypeScript**: Se exige modo **Strict** activado en TypeScript. Queda prohibido el uso de `any`, casts inseguros y respuestas sin tipar. Todo contrato debe usar interfaces o tipos explícitos (y Zod cuando aplique en runtime).
- **Patrones Existentes**: Antes de crear nuevo código o estructuras, el agente debe investigar la base de código actual (especialmente las entidades, los stores y la separación de responsabilidades) para mantener la consistencia del proyecto.
- **Dependencias**: No agregar nuevas dependencias de terceros sin justificación explícita.

> [!NOTE]
> Nota de Resolución de Conflictos:
> - `AGENTS.md` define reglas generales para agentes (como Antigravity).
> - `CLAUDE.md` adapta esas reglas específicamente para Claude.
> - `.agents/skills/` contiene skills especializados por dominio.
> - Las reglas documentadas aquí tienen prioridad absoluta sobre skills externos genéricos.
