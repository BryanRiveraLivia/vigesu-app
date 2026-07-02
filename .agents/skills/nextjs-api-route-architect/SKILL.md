---
name: nextjs-api-route-architect
description: Use this skill when creating, reviewing, refactoring, or debugging internal API routes in this Next.js 16.2.9 project, especially under the required /api folder with strict TypeScript contracts.
---

# Next.js API Route Architect Skill

## Project Constraints

- This project uses Next.js 16.2.9.
- All internal APIs must live under `/api` according to the project's existing structure.
- TypeScript strict mode is required.
- Avoid `any`, unsafe casts, and untyped API contracts.
- Prefer incremental refactors.
- Follow existing project conventions before introducing new patterns.
- Do not add new dependencies without justification.

## Instructions

1. **Centralized APIs:** Absolutely all internal endpoints must be placed inside the `/api` directory within the Next.js project. Do not create scattered endpoints elsewhere.
2. **Strict Validation:** Use Zod or a similar schema library to strictly validate all incoming requests and outgoing responses.
3. **Typed Contracts:** Ensure all inputs (body, query, params) and outputs are strongly typed.
4. **Clean Handlers:** Separate the HTTP transport logic (the Route Handler itself) from the underlying business logic or data access layer.
5. **Security:** Never expose secrets or environment variables to the client. Do not embed direct database queries inside UI components.
6. **Compatibility:** Ensure no feature breaks Next.js 16.2.9 standards.
