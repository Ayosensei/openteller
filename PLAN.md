# Openteller — Build Plan and Acceptance Checklist

As of 4 November 2026. NEAR Hackathon deadline: **14 November 2026, 23:59 UTC**. Prioritize a real, verified payment trail over visual extras. Milestones are sequential but may be combined if one short coding session covers both safely.

## Phase 0 — unblock the specification (4 November)

- [x] Approve `DESIGN.md` v5 replacement sections 10–20 (builder approval, 4 November 2026). They are replacements, not recovered original text.
- [ ] Decide login/session method and sign-in screen/route; record in `SPEC.md` and `ARCHITECTURE.md`.
- [ ] Decide durable database and hosting; choose free-tier if practical; write migrations and env vars.
- [x] Retrieve and read organizer's **original** https://nearhackathon.com/HACKATHON.md (verified 4 November 2026; re-read before submission because rules may change).
- [ ] Get partner JWT (securely, outside repo). Verify destination USDC asset and `EXACT_OUTPUT` through small/dry provider requests.
- [ ] Capture redacted examples of status response fields. Reconcile `INTEGRATIONS.md` V01–V06.

**Acceptance:** no security-critical architecture choices hidden; no API details represented as confirmed without evidence.

## Phase 1 — repo and design shell (4–5 November)

- [ ] Scaffold Next.js TypeScript/Tailwind (or inspect existing scaffold).
- [ ] `npm install motion && npx motion-ai`; `npm install react-aria-components`.
- [ ] Implement fonts, global CSS variables, Tailwind mapping, responsive shell, custom SVG icons and React Aria base wrappers.
- [ ] Implement reduced-motion and one-time below-the-fold landing scroll reveals without costly animation loops.
- [ ] Create domain models, migrations, repository layer, environment validation and test runner.

**Acceptance:** `npm run build`, lint and typecheck pass; design at 390/768/1024/1440 has no overflow; nothing needs live secrets to render fixtures.

## Phase 2 — invoices and persistence (5–7 November)

- [ ] Implement sign-in/ownership and authorization (following approved decision).
- [ ] Create invoice form with 1–20 items, integer money calculations, dates, notes and errors.
- [ ] Persist records, create secure public slug, copy share URL.
- [ ] Invoice list filters and details. Protect private routes; expose minimal safe public invoice.
- [ ] Implement tape and slab visual states from `DESIGN.md`, initially from marked fixtures.

**Acceptance:** invoice survives refresh/restart; owner B cannot see owner A; public client page works without login; totals have deterministic unit tests.

## Phase 3 — actual quotes and payment tracking (7–10 November)

- [ ] Implement server-only 1Click tokens and quote adapters; real/dry modes explicitly labelled.
- [ ] Support selected token/network and payer-owned refund address; test input validation.
- [ ] Render deposit and deadline, prevent reuse after quote expiry.
- [ ] Persist each quote/payment attempt and poll provider via supported status endpoint with rate limits and idempotent reconciliation.
- [ ] Verify actual status payload evidence; only real confirmed settlement can drive Paid.
- [ ] Add explicit errors for invalid routes, rejected quotes, `FAILED`, underpayment and refunds.

**Acceptance:** a replayable dry-quote walkthrough works with no money; an actual provider success cannot be faked by changing client React state; expired instructions disappear.

## Phase 4 — proof and exports (9–11 November)

- [ ] Bind origin/destination proof fields to verified response values only.
- [ ] Implement event history (new events animate; history on load is static).
- [ ] Implement safe CSV with one row per payment, tested formula-injection defense and clear headers.
- [ ] Implement print receipt only when it can truthfully represent settlement; otherwise a printable invoice/statement.

**Acceptance:** sample CSV opens in spreadsheet software; transactions link to correct explorer only when verified; fixture output cannot look live.

## Phase 5 — relayer decision (10–11 November)

- [ ] Prove an actual **app-specific NEAR contract action** requires sponsored gas; otherwise leave relayer explicitly out of MVP rather than adding security risk.
- [ ] If justified, deploy a minimal restricted relayer on testnet with funded builder-owned account, only approved receiver/method/limits; validate delegate signing and record tests.
- [ ] Never advertise zero source-chain gas.

**Acceptance:** either an allowlisted operation is demonstrably relayed, or docs explicitly state no relayer feature shipped.

## Phase 6 — live validation and polish (11–13 November)

- [ ] With builder approval and smallest feasible funds, do **one real** swap from a non-USDC token where supported and check both sides.
- [ ] Capture redacted tx evidence, actual received USDC, timestamps and CSV row.
- [ ] Validate reduced motion, accessible labels, keyboard flow, mobile payment screen and screen reader status announcements.
- [ ] Run lint, typecheck, tests, production build, dependency audit, secrets scan, performance checks and deployed smoke test.
- [ ] Get 3–5 freelancers to test if feasible, with permission for quotes/screenshots.

**Acceptance:** every claim in README/demo exactly matches observed production behavior.

## Phase 7 — submission (13–14 November)

- [ ] README: clear audience, screenshots, accurate features, setup, architecture, data safety, proof walkthrough, what's not live and constraints.
- [ ] Verify public repo and working deployed URL (if available).
- [ ] Record concise demo: create invoice → client quote/deposit → verified paid proof → CSV.
- [ ] Publish X post: explicitly say built at NEAR HACKATHON, tag **@NEARProtocol** and **#NEARHackathon**, attach video/screenshots.
- [ ] Submit public repository URL and demo post URL via official form **before 14 Nov 2026, 23:59 UTC**.

**Acceptance:** no missing submission fields; public repository runs from clean clone, and demo claims are supported.

## Cut line

Cut in this order: **milestones** → **PDF receipt** → **export filters** → optional relayer if no concrete contract need. Do not cut payment truthfulness, invoice persistence, cross-user authorization, public payment page, evidence trail or basic CSV.

## Agent session tracking template

```markdown
### Session: YYYY-MM-DD — milestone name
- Changes:
- Tests and commands:
- Live vs fixture-only functionality:
- Verified facts with sources:
- Open issues/blockers:
- Next milestone:
```
