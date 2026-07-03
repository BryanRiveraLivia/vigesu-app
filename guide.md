# Guía del Desarrollador (guide.md)

Esta guía te proporcionará los flujos de trabajo diarios, estándares y convenciones prácticas que debes seguir para desarrollar en **Vigesu**.

## 1. Convenciones de Nombres (Naming Conventions)

- **Carpetas y Archivos TS/TSX**:
  - Componentes React: `PascalCase.tsx` (ej. `ButtonPrimary.tsx`).
  - Funciones/Hooks/Utils: `camelCase.ts` (ej. `useAuth.ts`, `formatDate.ts`).
  - Archivos de rutas (Next.js): En minúsculas y obedeciendo el estándar de App Router (`page.tsx`, `layout.tsx`).
- **Variables y Funciones**:
  - `camelCase` siempre. Las funciones que manejan eventos deben llevar el prefijo `handle` (ej. `handleLoginSubmit`).
- **Tipos e Interfaces**:
  - `PascalCase` sin prefijos raros de "I" o "T" al inicio (ej. usar `User`, no `IUser`).

## 2. Formularios y Validaciones

Usamos la combinación sagrada de **React Hook Form** + **Zod**.

### Flujo de creación de un Formulario:
1. Define el esquema con `z.object()` en el mismo archivo (o en `src/entities` si se reutiliza).
2. Usa `z.infer` para crear el tipo de TypeScript.
3. Traduce los mensajes de error usando `next-intl`.

**Ejemplo Práctico:**
```tsx
const schema = z.object({
  email: z.string().email(t('error.invalid_email')),
  password: z.string().min(6, t('error.min_password'))
});
type FormData = z.infer<typeof schema>;

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema)
});
```

## 3. Internacionalización (next-intl)

- Todo texto visible para el usuario DEBE estar traducido. No "quemes" strings en los componentes `tsx`.
- Las traducciones viven en la carpeta `messages/[locale].json`.
- Usa el hook `const t = useTranslations('dominio')` en componentes de cliente (use client).
- Respeta la estructura anidada de los JSON de idioma.

## 4. Creando una Nueva Feature (Paso a Paso)

Supongamos que vas a crear el módulo "Usuarios":

1. **Entities (`src/entities/users.ts`)**: Define las interfaces `User`, `CreateUserDTO`, etc.
2. **Features (`src/features/users/`)**: Crea servicios (HTTP axios calls), Custom Hooks (ej. `useUsers.ts`) y Stores específicos si es necesario.
3. **Widgets (`src/widgets/UsersTable/`)**: Ensambla la UI compleja usando componentes de presentación puros.
4. **App (`src/app/[locale]/dashboard/users/page.tsx`)**: Crea la página de ruta, instancia el Widget y maneja metadatos de Next.js si aplica.

## 5. Preparándonos para Modificaciones y Refactorización

Cuando vayas a modificar componentes existentes (como lo que haremos constantemente):
1. Revisa si la lógica está mezclada con la presentación en `page.tsx`. Si es así, debes abstraer la lógica a un hook (ej. `useLoginForm.ts`) o a un servicio.
2. Comprueba el tipado. Elimina `any`. Sustituye por interfaces robustas.
3. Si un componente crece por encima de las ~200 líneas, es un candidato fuerte para ser descompuesto en subcomponentes de presentación.

Siempre mantén la consistencia visual utilizando las clases genéricas de `TailwindCSS` antes de aplicar estilos custom.
