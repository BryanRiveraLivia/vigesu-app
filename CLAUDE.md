# Instrucciones Específicas para Claude

Hola Claude. Cuando asistas en este proyecto, es vital que operes bajo las mismas reglas y decisiones arquitectónicas que utilizamos con Antigravity.

## Directrices para Claude

- **Metodología**: Debes respetar e inspeccionar la carpeta `.agents/skills/` como referencia metodológica principal.
- **APIs**: No debes crear APIs fuera de la carpeta `/api`. Todas las llamadas al backend y endpoints internos deben vivir estructuradas allí.
- **Tipado**: Mantén el tipado estricto (Strict TypeScript). Evita a toda costa el uso de `any`.
- **Arquitectura**: Sigue las mismas decisiones arquitectónicas detalladas en el archivo principal `AGENTS.md` y `bible.md`. Mapea modelos en Entities, UI en Presentation y lógica en Features.

> [!NOTE]
> Nota de Resolución de Conflictos:
> - `AGENTS.md` define reglas generales para agentes.
> - `CLAUDE.md` adapta esas reglas específicamente para Claude.
> - `.agents/skills/` contiene skills especializados por dominio.
> - Las reglas de proyecto tienen prioridad absoluta sobre skills externos genéricos.
