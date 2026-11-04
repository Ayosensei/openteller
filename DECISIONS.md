# Openteller — Decision Register

Status: 4 November 2026. This document distinguishes founder-approved scope from implementation proposals and unresolved blockers. To close an item, record the decision, rationale, date, and corresponding changes to the relevant source-of-truth docs.

## Approved by project direction

| Area | Decision |
| --- | --- |
| Project | Openteller (spelling assumed; confirm before registering domain/handles) |
| Target | Web3 freelancers invoicing crypto-native clients |
| Differentiator | Verified invoice payment trail + accountant-ready CSV |
| Hackathon | NEAR 2026, track 08 Real-World Money |
| Stack | Next.js, TypeScript, Tailwind CSS |
| Design | Builder-approved `DESIGN.md` v5, including replacement sections 10–20; custom tokens/type/icons and no default-looking UI kits |
| Approved libraries | `motion` + Motion AI Kit tooling + `react-aria-components` |
| Interaction | Subtle low-RAM motion, one-time below-the-fold scroll reveals, reduced-motion support |
| Constraints | No AI features; minimize spend; user-ready behavior not fake demo |

## Must decide before real production use

| ID | Question | Suggested direction (not approved) | Owner | Status |
| --- | --- | --- | --- | --- |
| D01 | Freelancer sign-in and session | **Recommended for approval:** Neon Managed Better Auth with Google and GitHub sign-in, HTTP-only managed sessions, `/sign-in`, and a visible sign-out action beside the account identity | Builder | OPEN |
| D02 | Durable DB and hosting | **Recommended for approval:** Neon Postgres free tier + Drizzle generated SQL migrations; Vercel Hobby for the noncommercial hackathon deployment, with a production plan decision before commercial use | Builder | OPEN |
| D03 | Replacement `DESIGN.md` sections 10–20 | Use the v5 replacements while preserving their `OPEN`/`VERIFY` gates | Builder | DECIDED 4 Nov 2026 |
| D04 | Receiving asset/account structure | Live token list verifies the NEAR USDC asset and 6 decimals; verify recipient type, receiving-account requirements and exact destination semantics with a builder-controlled dry quote | Builder + agent | PARTIAL / VERIFY |
| D05 | Refund address UX | Make payer provide network-valid, payer-controlled refund address | Builder + agent | OPEN |
| D06 | Quantity precision and monetary bounds | Adopt documented integer/fixed-decimal scheme with tests | Builder | OPEN |
| D07 | Failed/multiple/partial payments | Keep attempts separate; define recovery and aggregate amount rules | Builder + agent | OPEN |
| D08 | Need for custom NEAR contract/relayer | Only build if a real allowlisted contract call exists; otherwise remove gasless claim | Builder | OPEN |
| D09 | Quote polling/background tasks | Use a reliable server or scheduled mechanism matched to deployed host | Builder + agent | OPEN |
| D10 | Printable receipt and milestone invoices | Defer until P0 complete; prioritize CSV | Builder | OPEN |

## Important source discrepancy

The organizer's `HACKATHON.md` says unauthenticated 1Click swaps cost 0.2%, while the current official [API Keys page](https://docs.near-intents.org/integration/distribution-channels/1click-api/authentication) says an additional 0.25% for unauthenticated non-`ANY_INPUT` quotes and partner pricing that is typically 20 bps, or 1 bp on stablecoin and same-asset multichain routes. Until checked with an actual quote, **do not state an exact transaction cost in product UI**.

### D03 — Replacement design sections
- Date: 4 November 2026
- Owner/approval: Builder, by supplying regenerated `DESIGN.md` v5 and directing Phase 0 to proceed
- Final decision: Use the newly authored v5 sections 10–20 as the design authority. Do not describe them as recovered original text.
- Alternatives considered: Wait for the unavailable original sections; implement only sections 0–9.
- Evidence/source: `DESIGN.md` v5 status and section 20; builder instruction in the project session.
- Documents changed: `AGENTS.md`, `SPEC.md`, `PLAN.md`, `START-HERE.md`, `DECISIONS.md`.
- Implementation acceptance test: Each implemented screen follows its v5 screen specification while unresolved items remain gated by their `OPEN` or `VERIFY` marker.

## How to record a decision

```markdown
### DXX — Short name
- Date:
- Owner/approval:
- Final decision:
- Alternatives considered:
- Evidence/source:
- Documents changed:
- Implementation acceptance test:
```
