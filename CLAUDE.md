# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Bookify: users upload book PDFs and hold voice conversations with them (planned stack: Clerk auth, MongoDB/Mongoose, VAPI voice assistant with ElevenLabs voices). The project is early-stage: auth and UI exist; persistence, PDF processing and voice calls are not wired yet (e.g. the upload form's submit is simulated, the homepage renders `sampleBooks` from `lib/constants.ts`).

## Commands

- `npm run dev` — dev server on http://localhost:3000 (also regenerates `AGENTS.md`)
- `npm run build` / `npm start`
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`)

There is no test framework configured.

## Stack notes

- **Next.js 16 + React 19** (App Router). APIs differ from older versions — check `node_modules/next/dist/docs/` before using framework APIs. Notably, middleware lives in `proxy.ts` (not `middleware.ts`), and route props use the global generated types like `LayoutProps<"/">` / `PageProps<...>`.
- **Clerk** (`@clerk/nextjs` v7 + `@clerk/ui`): `clerkMiddleware()` in `proxy.ts`; `ClerkProvider` in `app/layout.tsx` with the `shadcn` theme. Sign-in/up are catch-all routes `app/sign-in/[[...sign-in]]` and `app/sign-up/[[...sign-up]]`. Env vars in `.env` (gitignored): `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, sign-in/up URLs and fallback redirects. `lib/constants.ts` also reads `NEXT_PUBLIC_ASSISTANT_ID` (VAPI). Clerk agent skills are installed under `.agents/skills/`.
- **Tailwind CSS v4** (CSS-first, no `tailwind.config`): theme tokens in `@theme inline` and most component styling as named classes in `@layer utilities` inside `app/globals.css` (e.g. `wrapper`, `library-books-grid`). Prefer reusing/adding classes there over long inline utility strings, matching existing components.
- **shadcn/ui** with style `base-lyra` built on `@base-ui/react` (not Radix); `components.json` sets the icon library to Phosphor, though existing components also use `lucide-react`. Primitives go in `components/ui/`; `cn()` is in `lib/utils.ts`.
- Fonts: IBM Plex Serif and Mona Sans via `next/font/google`, exposed as CSS variables.

## Structure

- `app/(root)/` — route group for the main app (homepage, `books/new` upload page); the root layout renders `Navbar` above all routes.
- `components/` — app components (PascalCase files). The upload flow is `UplaodForm.tsx` (note the filename typo) composing `FileUploader`, `VoiceSelector`, `LoadingOverlay`, using react-hook-form + `zodResolver`.
- `lib/zod.ts` — `UploadSchema` (title, author, persona, PDF ≤50MB, optional cover image ≤10MB); limits/accepted MIME types come from `lib/constants.ts`.
- `lib/constants.ts` — brand colors, sample data, ElevenLabs `voiceOptions`/`voiceCategories`/`DEFAULT_VOICE`, VAPI reference config, Clerk appearance overrides.
- `types.d.ts` — shared app types (DB model interfaces, form values as `z.infer<typeof UploadSchema>`, component props), imported as `@/types`. It imports `mongoose`, which is not yet in `package.json`.
- Path alias `@/*` maps to the repo root.
