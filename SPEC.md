# Openteller — Product Specification

Status: implementation baseline, 4 November 2026. Product decisions come from the project context; unresolved implementation choices are explicitly marked **OPEN**. Read alongside `DESIGN.md`, `INTEGRATIONS.md`, and `ARCHITECTURE.md`.

## 1. Product

Openteller is invoicing for web3 freelancers billing crypto-native clients. The freelancer creates a USDC-denominated invoice, shares a link, and the client pays using a supported token and chain. The invoice shows **what the client sent**, **what the freelancer actually received**, and **verifiable evidence** for each leg; users can export a straightforward ledger to CSV.

Audience: independent designers, developers, writers and community managers working with DAOs, web3 startups, and crypto-native teams. Do not advertise fiat checkout or cash-out.

**North-star user outcome:** A freelancer can show an accountant a completed invoice, the amount received, when it settled and the evidence linking it to the payment.

**Product constraints:** real functionality, minimal/no spend, no AI features, no stock/AI-looking design, zero unsupported claims, and a small hackathon-sized scope.

## 2. Roles

- **Freelancer (authenticated):** creates and views their own invoices, shares links, sees settlement evidence, voids eligible invoices, exports records, and prints a receipt.
- **Client (unauthenticated):** visits a sufficiently unguessable public invoice link, sees the bill, chooses a supported origin asset, receives a live quote, pays, and sees accurate progress/confirmation.
- No admin dashboard, business/team accounts, email automation, or additional account types.

**DECIDED 4 November 2026:** Freelancer identity uses Neon Managed Better Auth with Google and GitHub providers at `/sign-in`. Neon manages HTTP-only sessions; every private server query and mutation is scoped to the authenticated Neon subject. A connected wallet or receiving NEAR account is never treated as authentication. Provider configuration and production redirect origins must pass the auth deployment checklist before real data is accessible.

## 3. Routes and page purpose

| Route | Purpose | Source |
| --- | --- | --- |
| `/` | Marketing/landing | `DESIGN.md` |
| `/invoices` | Private invoice index: search, status filtering, totals | `DESIGN.md` |
| `/invoices/new` | Create invoice and live summary | `DESIGN.md` |
| `/invoices/[id]` | Freelancer-only details, proof slab, trail, copy link | `DESIGN.md` |
| `/i/[slug]` | Public invoice/payment flow; no client login | `DESIGN.md` |
| `/invoices/[id]/receipt` | Printable evidence-based receipt | `DESIGN.md` |
| `/exports` | Private CSV export | `DESIGN.md` |
| `/sign-in` | Freelancer sign-in with Google or GitHub through Neon Managed Better Auth | `DESIGN.md` |
| Error/404 | Honest, actionable error and missing-invoice states | `DESIGN.md` |

No extra navigational destinations unless approved. Freelancer top bar contains **Invoices** and **Exports** only.

## 4. MVP workflow and acceptance criteria

### A. Create invoice
1. Authenticated freelancer enters client name/identifier, an issue date, a due date, one to twenty items, optional note (maximum 500 characters), and a verified NEAR USDC receiving destination.
2. Each item has a description, quantity, and unit price. Calculate money in **integer minor units**; never sum floats. Require nonempty descriptions, quantities greater than zero with at most three decimal places, and a positive total. Unit prices and invoice totals cannot exceed 1,000,000 USDC. **DECIDED 5 November 2026.**
3. Store an immutable invoice number (unique for its owner), durable internal ID and high-entropy share slug. Give a copyable public URL.
4. A reload keeps the invoice; a failure never fabricates success.
5. Due dates are for billing, not proof of payment. Overdue is a computed indicator, not a payment status.

### B. Pay invoice
1. Client opens `/i/[slug]`, verifies recipient, invoice amount, and line items.
2. Client selects one supported origin token/network from the actual 1Click token list; the server requests a quote. Prefer `EXACT_OUTPUT` for the precise USDC invoice amount; confirm a usable destination asset/route and semantics with real quotes. Never assume all tokens/chains support every route.
3. Display the amount to send, exact chain, correct recipient/deposit information, deadline, and any relevant caveats/fees. Refund destination must belong to the payer: never silently insert the freelancer's address.
4. On `ORIGIN_CHAIN` deposits, the client pays the returned **quote-specific** deposit address using their own wallet. Do not claim Openteller signs or sends the client's transaction unless an actual wallet integration is implemented.
5. The status UI is driven by the verified status API. **Only observed `SUCCESS` plus verified received payment evidence can show Paid.** Show Pending, Underpaid or Refunded where applicable; show failures distinctly, not as Paid.
6. Quote expiry disables obsolete payment instructions and offers a fresh quote. Do not reuse a stale deposit address.
7. Client must be clearly warned against sending incompatible tokens/networks or paying expired quotes.

**OPEN:** source transaction hash / destination settlement hash and exact received USDC fields must be verified against a genuine status payload or explorer data before implementing a 'complete payment trail'.

### C. Proof/trail
- Invoice created is an app-generated event.
- Payment detected, confirmed, settled, incomplete, and refunded are emitted **only** from trusted provider/chain evidence.
- Timeline entries are timestamped and append-only; no retroactive presentation of fictional events.
- Show origin token/network/amount/hash and destination USDC/NEAR amount/hash only if verified; otherwise use an explicit unavailable/pending label and a safe explorer link where possible.
- No `Paid` stamp unless the invoice has been genuinely paid.

### D. Export and receipt
- CSV includes invoice ID/number, client, issue date, due date, invoiced USDC total, settlement status, received USDC amount, original paid token/network/amount, available hashes and explorer URLs, timestamps and relevant line-item detail.
- **One row per payment** when payments exist. For unpaid invoices, choose a separate unpaid-invoice report or blank payment fields; do not represent an unpaid invoice as a payment row. Export scope needs a clear header/README explanation.
- Escape CSV fields correctly, guard against spreadsheet formula injection, preserve full identifier values, use UTF-8, and include a stable header.
- Do not put secrets into exports. A receipt is labelled a receipt only for verified Paid; otherwise label as invoice/statement.

## 5. Status vocabulary

| UI status | Meaning | Provenance |
| --- | --- | --- |
| Open | Created, no active verified payment | App |
| Pending | Deposit detected or processing, not yet delivered | 1Click |
| Paid | Successful settlement for the invoiced amount, confirmed by backend | 1Click + reconciliation |
| Underpaid | Provider reports incomplete deposit; outstanding balance remains | 1Click; detailed amount **VERIFY** |
| Refunded | Provider reports refunded | 1Click; refund details **VERIFY** |
| Void | Freelancer canceled an eligible unpaid invoice | App |

A provider `FAILED` outcome is **not** mapped to Paid or silently to Refunded. Show an explicit action-required error, store provider status, and decide whether the invoice returns to Open when eligible. **OPEN:** finalize failure and multi-attempt transitions with actual response examples.

## 6. MVP priorities

**P0:** working persistent invoice creation, public share links, safe client quote/pay instructions, accurate provider-backed status, verified payment trail, downloadable CSV, clean deployment, documentation/tests.

**P1:** printable receipt and gasless restricted relayer if its precise role is necessary and achievable; never fake gasless. The relayer cannot pay for a client's origin-chain transaction merely by existing on NEAR.

**P2:** milestone invoices, monthly/client summaries, sophisticated export filters. Cut in that order if schedule is tight.

Explicitly excluded: fiat on/off ramp, AI assistant/features, DAO workflows, price feeds, unsupported tokens, complex team permissions, chat, notification center, elaborate custom wallet, unsupported recurring billing.

## 7. UX and accessibility

`DESIGN.md` is normative for design tokens, copy, breakpoint behavior, custom icons, React Aria Components, and Motion. Paid and pending distinctions must be textual, not color-only. Support full keyboard usage, meaningful focus, mobile 390px, and reduced motion. Initial payment controls must not be hidden behind scroll reveals.

## 8. Quality and truthfulness gates

- A genuine invoice and export survive process restart and deployment; not only `localStorage` or fixture state.
- Cross-user private routes and exports are denied by authorization tests; public slugs expose only intended client-visible fields.
- API secrets, relayer keys, and server trust decisions never reach the browser.
- Status transitions are monotonic where appropriate, idempotent across polls, and auditable.
- Stale/expired quotes cannot be used in the active UI. Reconciliation must tolerate out-of-order responses.
- Never claim verified onchain payment without supporting identifiers and a checked settlement amount.
- Distinguish a screen driven by fixtures from a live payment in README and demo.

## 9. Success proof

Ideal: 3–5 real web3 freelancers use the product; at least one deliberately small real cross-chain paid invoice is demonstrably verified; CSV opens clearly in a spreadsheet. Record consent-based screenshots/quotes and disclose exactly what was tested. No claim of real user adoption without evidence.

## 10. Open decisions to resolve before live release

1. Authentication/session method and sign-in design: **DECIDED** — Neon Managed Better Auth, Google/GitHub, `/sign-in`; implementation and provider configuration remain to be verified.
2. Durable low-cost database provider and hackathon hosting: **DECIDED** — Neon Postgres with Drizzle SQL migrations and Vercel Hobby for the noncommercial hackathon deployment. Backup/restore verification and commercial production hosting remain open before launch.
3. Correct USDC-on-NEAR destination asset, account requirements, and receipt verification source.
4. Quote refund address collection and cross-chain validation; prevent payer funds being refunded to the wrong account.
5. Invoice value bounds and currency/quantity precision: **DECIDED** — quantities allow at most three decimal places; unit prices and invoice totals are capped at 1,000,000 USDC.
6. Multi-attempt/partial payment handling and `FAILED` transition behavior.
7. Relayer's legitimate app-specific contract/action, required deployment, and whether it adds any value to the base invoicing flow.
8. `DESIGN.md` v5 replacement sections 10–20 were approved by the builder on 4 November 2026. Their remaining `OPEN` and `VERIFY` items still require the decisions or evidence named there.
