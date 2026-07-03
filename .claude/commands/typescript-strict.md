---
description: Enforce TypeScript strict mode, define DTOs, implement schemas, handle typings, and review type safety across the project.
---

# TypeScript Strict Engineer Skill

## Project Constraints

- This project uses Next.js 16.2.9.
- All internal APIs must live under `/api` according to the project's existing structure.
- TypeScript strict mode is required.
- Avoid `any`, unsafe casts, and untyped API contracts.
- Prefer incremental refactors.
- Follow existing project conventions before introducing new patterns.
- Do not add new dependencies without justification.

## Instructions

1. **Strict Mode:** Validate that `strict: true` is respected in `tsconfig.json`.
2. **Zero Any:** Ban the use of `any`. When the shape of data is truly unknown, use `unknown` and narrow it down with type guards or Zod.
3. **Explicit Contracts:** Define explicit interfaces/types for props, API requests (DTOs), API responses, and domain models.
4. **Discriminated Unions:** Leverage discriminated unions for complex states (e.g., success vs. error responses, UI variants) to ensure exhaustiveness checking.
5. **Typed Errors:** Ensure errors caught in `catch` blocks are properly typed or narrowed before accessing their properties.
6. **No Silencing:** Do not use `as any`, `// @ts-ignore`, or unnecessary type assertions to bypass compiler checks. Solve the type issue properly.
