---
name: nextjs-16-architect
description: Use this skill when making architectural decisions, routing, caching, streaming, or performance optimizations for this Next.js 16.2.9 project.
---

# Next.js 16 Architect Skill

## Project Constraints

- This project uses Next.js 16.2.9.
- All internal APIs must live under `/api` according to the project's existing structure.
- TypeScript strict mode is required.
- Avoid `any`, unsafe casts, and untyped API contracts.
- Prefer incremental refactors.
- Follow existing project conventions before introducing new patterns.
- Do not add new dependencies without justification.

## Instructions

1. **App Router Only:** Ensure all routing decisions utilize the Next.js App Router paradigm. 
2. **Server Components as Default:** Use React Server Components by default. Only add the `"use client"` directive when interactivity (hooks, event listeners) or browser APIs are strictly required.
3. **Server Actions:** Implement Server Actions for form mutations and data updates only if they provide a clear advantage over standard API routes.
4. **Performance & Caching:** Apply proper caching strategies, revalidation paths, and streaming (using `Suspense` and `loading.tsx`) to optimize Time To First Byte (TTFB).
5. **Clean Structure:** Maintain a clean folder structure and avoid mixing Next 12/13 obsolete patterns.
6. **Documentation:** If there are Next 16 specifics in doubt, always refer to local/versioned Next.js documentation for 16.2.9.
