# Agent Skills Inventory

## Project
- Next.js: 16.2.9
- API location: /api
- TypeScript: strict
- Primary agent: Antigravity
- Secondary agent: Claude

## Installed Skills

| Skill | Source Repo | Local Path | Adapted | Purpose |
|---|---|---|---|---|
| nextjs-16-architect | gocallum/nextjs16-agent-skills | .agents/skills/nextjs-16-architect | Yes | Architectural decisions, App Router, caching, streaming, performance in Next 16.2.9 |
| nextjs-api-route-architect | vercel-labs/agent-skills | .agents/skills/nextjs-api-route-architect | Yes | Create and maintain APIs exclusively under `/api` with strict validation. |
| tailwind-ui-engineer | sickn33/antigravity-awesome-skills | .agents/skills/tailwind-ui-engineer | Yes | Tailwind CSS components, responsiveness, reusability, and accessibility. |
| typescript-strict-engineer | gocallum/nextjs16-agent-skills | .agents/skills/typescript-strict-engineer | Yes | Enforce strict mode, domain types, DTOs, and eliminate `any`. |
| mongodb-data-modeler | sickn33/antigravity-awesome-skills | .agents/skills/mongodb-data-modeler | Yes | Document schema design, indexing, and efficient queries. |
| postgresql-query-designer | sickn33/antigravity-awesome-skills | .agents/skills/postgresql-query-designer | Yes | Relational design, transactions, SQL injection prevention. |
| terraform-iac-reviewer | hashicorp/agent-skills | .agents/skills/terraform-iac-reviewer | Yes | Modern IaC, remote state, safe infrastructure changes. |
| qa-playwright-engineer | sickn33/antigravity-awesome-skills | .agents/skills/qa-playwright-engineer | Yes | Playwright E2E testing, API tests, POM pattern, smoke tests. |
| software-architect | vercel-labs/agent-skills | .agents/skills/software-architect | Yes | Clean Architecture, SOLID, modularity by feature. |
| security-code-reviewer | google/skills | .agents/skills/security-code-reviewer | Yes | Secrets management, input/output validation, auth boundaries. |

## Project Rules

- All internal APIs must live under `/api`.
- Keep TypeScript strict.
- Avoid `any`.
- Validate API inputs and outputs.
- Separate UI, services, data access, and domain logic.
- Prefer incremental refactors.
- Do not add dependencies without justification.
- Do not overwrite existing agent instruction files.

## Notes for Antigravity

Use `.agents/skills/` as the local skill source.

## Notes for Claude

Respect `.agents/skills/`, `AGENTS.md` / `agents.md`, and `CLAUDE.md`.
