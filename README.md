# kervis-workflow

CLI que copia en tu proyecto reglas para Cursor (`AGENTS.md`) y guías de workflow (`skills/`): Conventional Commits, TypeScript estricto, React 19, arquitectura hexagonal, Tailwind, etc.

## Instalación

```bash
# 1. Instalar en tu proyecto
pnpm add -D github:KervisG/kervis-workflow

# 2. Crear AGENTS.md y skills/ en la raíz (preset frontend por defecto)
pnpm exec kervisworkflow init --with-skills

# Backend preset (crea backend/AGENTS.md)
pnpm exec kervisworkflow init --preset backend --with-skills
```

Requisitos: Node.js >= 18
