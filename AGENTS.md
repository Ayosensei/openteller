# AGENTS.md — Standing Instructions for Codex/Claude Code

Read this file **first**, then `SPEC.md`, `INTEGRATIONS.md`, `ARCHITECTURE.md`, `PLAN.md`, and `DESIGN.md` before changing app code. If present, use the organizer's `HACKATHON.md` for submission requirements. Do not treat docs marked VERIFY/OPEN as implemented facts.

## Mission

Build **Openteller**, a real invoicing tool for web3 freelancers. The differentiator is the payment trail: what a client sends, what a freelancer actually receives, and proof of both, exportable to CSV. Enter NEAR Hackathon, track 08 Real-World Money. No AI features.

## Non-negotiables

1. Stack: Next.js App Router, strict TypeScript, Tailwind CSS. Install `motion`, run `npx motion-ai`, and install `react-aria-components` as requested. Use them per `DESIGN.md` without replacing its custom visual language.
2. `DESIGN.md` is authoritative for appearance, design tokens, motion, scroll reveals, accessibility and screen inventory. **No generic icon packs or default UI kits.** Custom SVG icons; approved fonts.
3. `SPEC.md` owns product behavior; `INTEGRATIONS.md` owns verified API facts. Do not invent addresses, fees, event histories, transaction IDs, timings or statuses.
4. Low-cost first. Never incur a real swap cost or deploy a funded relayer without the builder's approval.
5. Never commit API tokens, keys, credentials, real user information, `.env.local`, or test wallets with funds. `NEXT_PUBLIC_` must never prefix a secret.
6. No mock data shown as a real paid invoice. Fixture mode must be clearly identifiable; real results must come from trusted server-side verification.
7. Authentication and durable persistence are required for real use; pick neither silently. Surface any OPEN blocking choice in a short question/decision log rather than making up a security architecture.
8. `DESIGN.md` v5 includes builder-approved replacement sections 10–20. They are newly authored specifications rather than recovered original text; follow their remaining `OPEN` and `VERIFY` markers without inventing answers.
9. Prefer minimal well-tested dependencies. No new features/routes/library families without approval; Motion + React Aria are explicitly approved.
10. Maintain source-of-truth docs when an approved decision changes implementation. Do not silently change user-facing copy or visual tokens.

## Setup commands

```bash
# If repository is empty, scaffold a Next.js TypeScript App Router project
npx create-next-app@latest . --typescript --tailwind --eslint --app
npm install motion
npx motion-ai
npm install react-aria-components
npm run dev
npm run lint
npm run build
```

`npx motion-ai` is a tooling/agent setup step, **not** a runtime animation library. It may alter tool configuration; inspect its output and generated files before committing. The scaffolding command is a suggested starting point, not a mandate to overwrite an existing repo. Define and document `npm run typecheck`, `npm test`, and `npm run test:e2e` when test tooling is chosen.

## Working procedure

1. Read the next unchecked milestone in `PLAN.md` and the relevant design section.
2. Write the smallest meaningful implementation and its tests.
3. Verify responsive layouts at 390/768/1024/1440 widths and keyboard/reduced motion.
4. Run formatting/lint, typecheck, tests and a production build, fixing issues before saying a milestone is done.
5. Mark only truly verified integration details as Verified with source/date and redacted evidence.
6. Write a concise change summary: what works, what is fixture-only, verification commands, and remaining blockers.

## Definition of done

From a clean checkout, a second developer can follow README to start locally and validate the main flow; a stored invoice survives restart; authorization rules hold; payment status and proof are not fabricated; CSV opens cleanly; UI follows DESIGN; docs match the actual system. A mock-only prototype is **not** a complete paid-invoice product.

## Review checkpoints requiring approval

Auth/session choice, production database/hosting, any new paid service or live swap, externally funded relayer and whitelist target, changed product scope, and any unresolved design OPEN point that blocks correct behavior.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
