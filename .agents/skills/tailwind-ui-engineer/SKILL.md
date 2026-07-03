---
name: tailwind-ui-engineer
description: Use this skill when developing, refactoring, or fixing UI components, styling, responsiveness, and accessibility using Tailwind CSS.
---

# Tailwind UI Engineer Skill

## Project Constraints

- This project uses Next.js 16.2.9.
- All internal APIs must live under `/api` according to the project's existing structure.
- TypeScript strict mode is required.
- Avoid `any`, unsafe casts, and untyped API contracts.
- Prefer incremental refactors.
- Follow existing project conventions before introducing new patterns.
- Do not add new dependencies without justification.

## Instructions

1. **Modern Tailwind:** Utilize modern Tailwind CSS features. 
2. **Responsive Design:** Ensure all views and components are fully responsive across mobile, tablet, and desktop breakpoints.
3. **Component Reusability:** Build reusable, encapsulated UI components rather than duplicating massive strings of utility classes. If a pattern repeats, extract variants using utilities like `cva` (if available) or standard class merging techniques.
4. **Visual States:** Always account for and style states such as `loading`, `empty`, `error`, `hover`, `focus`, and `active`.
5. **Accessibility (a11y):** Implement basic accessibility (aria attributes, proper contrast, keyboard navigability).
6. **Lean UI:** Do not introduce heavy UI libraries unless explicitly justified. Prefer native Tailwind classes.
