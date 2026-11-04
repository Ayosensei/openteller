# Openteller

**Invoice in USDC. Get paid from supported crypto networks. Keep the proof.**

> **Project status:** implementation starter. This repository documentation describes a product being built for NEAR Hackathon 2026. It does **not** assert that live payments, wallet authentication, production persistence, or a gas relayer are already operational.

## What Openteller is

Openteller helps web3 freelancers invoice crypto-native clients. The client receives a shareable invoice, selects a supported token/network, and pays through a NEAR Intents 1Click quote. The freelancer sees a status trail and, once settlement is verified, the source and destination evidence for the payment. Payment rows can be exported to CSV for accounting.

**Problem:** cross-chain crypto payments often leave disconnected transaction links, unclear settlement values and an accounting headache. Openteller aims to put the invoice and its payment proof together.

## Who it's for

Freelance designers, developers, writers and community managers working with crypto-native clients and DAOs. This is not fiat checkout and does not include cash-out to a bank account.

## Planned features (not claims of completion)

- USDC-denominated invoice creation, line items and due date.
- Client-facing public invoice URL with quote-specific payment instructions.
- Provider-backed open/pending/paid/underpaid/refunded status display where supported.
- Payment trail of client-sent and freelancer-received values with transaction links where verified.
- CSV payment export and optional printable evidence receipt.
- Lightweight responsive UI: Motion for subtle transitions, React Aria Components for accessible interactions.

## Technology

Next.js App Router, strict TypeScript, Tailwind CSS, Motion, React Aria Components, Neon Postgres with Drizzle migrations, Neon Managed Better Auth and the NEAR Intents 1Click API. Vercel Hobby is approved only for the non-commercial hackathon demo. Any contract or funded relayer remains **OPEN**.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill the server variables listed in `.env.example`; never paste credentials into source files or the template. The current home page is an implementation baseline and does not make live payment claims.

Validation commands:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Intended payment workflow

1. Freelancer signs in and creates a USDC invoice.
2. Freelancer shares its public link.
3. Client chooses an origin asset and supplies a **payer-controlled** refund address.
4. The server gets a time-limited 1Click quote. The payer sends funds from their own wallet to the quote's deposit address on the specified chain.
5. The server checks the provider status, stores events and confirms the actual settlement evidence before showing Paid.
6. Freelancer exports payment records to CSV.

**Live integration:** no NEAR Intents testnet exists. Dry quotes and fixtures allow much of the app to be developed without a real payment; a real paid-invoice demo requires small **mainnet** funds and builder approval. Any screenshot/demo must say whether it shows fixture data or a verified live payment.

## Accounting/export conventions

Invoices are denominated in USDC. The payment CSV is one row per actual payment when such rows exist, with clear identifiers, invoice value, received value, input asset and chain, hashes and timestamps when available. Blank proof fields mean no proof has been observed; they are **not** fabricated. Payment processing fees and token conversion may affect received amounts; actual values take precedence over estimates. Export does not replace tax or legal advice.

## Important limitations

- No fiat on-ramp, off-ramp or bank payout.
- Supported tokens/routes depend on the live 1Click response.
- Fee quotes, refund behavior, precise status fields and transaction links require integration verification; see `INTEGRATIONS.md`.
- A NEAR relayer, if built, sponsors **specific NEAR actions only**, not any source-chain token transfer fee.
- The approved auth and database architecture still must be implemented and deployed before real multi-user use.

## Read the project docs

| File | Purpose |
| --- | --- |
| [`AGENTS.md`](./AGENTS.md) | Instructions and constraints for coding agents |
| [`SPEC.md`](./SPEC.md) | Product scope, roles, flows and acceptance checks |
| [`INTEGRATIONS.md`](./INTEGRATIONS.md) | Verified provider facts, open verification items, safe handling |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Proposed data model, state mapping, boundaries and tests |
| [`DESIGN.md`](./DESIGN.md) | Visual system, React Aria, Motion and accessibility |
| [`PLAN.md`](./PLAN.md) | Milestones, priorities, demo and submission checklist |
| [`DECISIONS.md`](./DECISIONS.md) | Unresolved security/implementation decisions |

## Hackathon

NEAR Hackathon 2026, track **08 Real-World Money (`realworld`)**. Organizer details: https://nearhackathon.com/ and https://nearhackathon.com/HACKATHON.md. Submission deadline **14 November 2026, 23:59 UTC**. A public GitHub repository and X demo post with @NEARProtocol and #NEARHackathon are required.

## Current verification state

- Product goals and design requirements: documented.
- 1Click endpoints and high-level provider statuses: confirmed in official documentation, as of 4 November 2026.
- Actual 1Click quote and status JSON for Openteller's intended USDC receiving route: **not yet tested in this pack**.
- Real invoice settlement and real-user adoption: **not established**.

Update this section only with tangible build/test evidence; do not turn planned features into completed claims automatically.
