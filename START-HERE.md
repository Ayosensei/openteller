# Start Here — Openteller agent handoff

Copy all files in this folder into the **root of a new Openteller repository**. Keep `DESIGN.md` intact; it is the approved v5 design-system file. Give Codex this instruction:

> Read AGENTS.md, SPEC.md, INTEGRATIONS.md, ARCHITECTURE.md, PLAN.md, DESIGN.md and DECISIONS.md before coding. Start with Phase 0 of PLAN.md, identify blockers and source contradictions, then scaffold a Next.js + TypeScript + Tailwind application. Install `motion`, run `npx motion-ai`, and install `react-aria-components`. Build the narrowest functioning persistent invoice-and-CSV flow first. Keep 1Click integrations behind typed adapters and mark unverified behavior explicitly. Never simulate a paid transaction as if it were real; never spend money without approval. Follow DESIGN.md strictly, including one-time low-cost scroll reveals. Complete each milestone with tests and update the decision register.

## Cautions

1. `DESIGN.md` v5 contains builder-approved replacement sections 10–20. They are newly authored specifications rather than recovered original text; preserve all remaining `OPEN` and `VERIFY` gates.
2. The organizer's original `HACKATHON.md` was retrieved and read on 4 November 2026. Fetch the live file again before submission because its own instructions say dates and rules may change.
3. Integration docs and README state verified *documentation facts* separately from features that actually work. Real settlement verification still needs implementation and live evidence.

## Recommended first deliverable from Codex

A runnable scaffold with global design tokens, React Aria wrappers, Motion setup, persistence/auth decision documented, and a tested local invoice create/list/public read flow. Defer real swap until quote and refund semantics are verified.
