# Openteller — Integrations and Verification Register

Status: source-checked 4 November 2026; **not** a guarantee of a functioning production integration. Product design decisions are in `SPEC.md`. Everything marked **VERIFY** must be checked against current provider documentation and an actual response before live use.

## Verified from official public documentation

### NEAR Intents / 1Click API

- 1Click is a cross-chain swap flow, **not** a testnet service. Its quickstart says there is no NEAR Intents testnet: test swaps use small real amounts. [Quickstart](https://docs.near-intents.org/integration/distribution-channels/1click-api/quickstart/introduction).
- `GET https://1click.chaindefuser.com/v0/tokens` lists assets with `assetId`, decimals, blockchain, symbol. Do not hardcode all supported chains/assets. [Making a Request](https://docs.near-intents.org/integration/distribution-channels/1click-api/quickstart/making-a-request).
- `POST https://1click.chaindefuser.com/v0/quote` requests a quote. Documented fields include `dry`, `swapType`, `slippageTolerance`, `originAsset`, `depositType`, `destinationAsset`, `amount` (base units), `recipient`, `recipientType`, `refundTo`, `refundType` and `deadline`. [Making a Request](https://docs.near-intents.org/integration/distribution-channels/1click-api/quickstart/making-a-request).
- `swapType` supports `EXACT_INPUT` and `EXACT_OUTPUT`; the guide also names `FLEX_INPUT` and `ANY_INPUT`. `EXACT_OUTPUT` existence is verified, but **which routes honor the requested USDC amount and fee/slippage rules still need live quote tests**.
- `dry: true` validates and returns a quote **without executing the swap** (per current quickstart); it does **not** eliminate the possibility of platform API costs/rate limits or guarantee route success for a live swap.
- For `depositType: ORIGIN_CHAIN`, send funds to the quote's returned `depositAddress`. The transfer initiates the swap on deposit. A deposit must be made by the payer from their wallet, not fabricated by the frontend. Optionally notify `POST /v0/deposit/submit` with `depositAddress` and `txHash`.
- `GET https://1click.chaindefuser.com/v0/status?depositAddress=...` returns status. Documented values: `PENDING_DEPOSIT`, `KNOWN_DEPOSIT_TX`, `PROCESSING`, `SUCCESS`, `INCOMPLETE_DEPOSIT`, `REFUNDED`, `FAILED`. [Making a Request](https://docs.near-intents.org/integration/distribution-channels/1click-api/quickstart/making-a-request).
- A partner JWT is available from the [Partner Dashboard](https://partners.near-intents.org/home). Store it server-side and send `X-API-Key: <JWT>` or `Authorization: Bearer <JWT>`. The current API-key page says unauthenticated non-`ANY_INPUT` quotes add 0.25% and authenticated requests use partner pricing, typically 20 bps or 1 bp for stablecoin and same-asset multichain routes. The organizer's `HACKATHON.md` still says 0.2% unauthenticated. **Verify the actual quote and never promise zero or a fixed fee.** [API Keys](https://docs.near-intents.org/integration/distribution-channels/1click-api/authentication).
- Live `GET /v0/tokens` verification on 4 November 2026 returned one `USDC` entry for `blockchain: near`: `assetId` and `contractAddress` `nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1` / `17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1`, with 6 decimals. Treat the token list as dynamic and resolve this at runtime rather than relying only on the recorded value.
- The official OpenAPI schema fetched on 4 November 2026 defines status responses with `correlationId`, the original `quoteResponse`, `status`, `updatedAt`, and `swapDetails`. `swapDetails` includes optional exact input/output amounts, intent and NEAR hashes, origin and destination transaction objects with provider-supplied explorer URLs, deposited amount, refund fields and withdrawal fee. Actual field population by status still needs a redacted real response.
- The [NEAR Intents Explorer](https://explorer.near-intents.org/) can be searched using a deposit address. Do not infer that it exposes every origin and destination transaction field until tested.

### NEAR meta transaction relayer

- A relayer sponsors NEAR gas for a signed delegated transaction; it hosts a **funded** NEAR account, so gas is not free to the operator. [Official tutorial](https://docs.near.org/web3-apps/tutorials/meta-transactions).
- The tutorial describes `SignedDelegate`/`SignedDelegateAction` and gating by contract, sender, action/method and limits. The tutorial also notes wallet signing support limitations: **verify your selected wallet can actually sign a delegate action** before promising the experience.
- `NEAR` testnet relayer work is distinct from the 1Click mainnet payment route. **Never claim the relayer removes the client's source-chain transfer fees.**

### Hackathon

- Track is **08 Real-World Money** (`realworld`); a working prototype in a public repository and public X demo post saying it was built at NEAR HACKATHON, tagging @NEARProtocol and #NEARHackathon, are required. Submit both links once before 14 November 2026, 23:59 UTC. The organizer's original [HACKATHON.md](https://nearhackathon.com/HACKATHON.md) was retrieved and read on 4 November 2026; it must be re-read before submission because rules may change.

## VERIFY: provider behavior still missing live evidence

| ID | Question | Why it matters | Safe implementation before verification |
| --- | --- | --- | --- |
| V01 | Official schema now identifies status/evidence fields; capture which fields are actually populated in redacted responses for each relevant status | Core product differentiator | Type a normalized `PaymentEvidence` with optional values; fixture-only rows explicitly marked `demo` |
| V02 | Actual `EXACT_OUTPUT` quote for desired USDC on NEAR and usable deposit instructions | Guarantees/fees | `dry` request; fail closed on unsupported routes |
| V03 | Live token list confirms the NEAR USDC asset and 6 decimals; verify recipient type, account/storage constraints and whether intended settlement is NEP-141 or Intents balance with a dry quote | Receive what product promises | Resolve the live token entry and block quote creation until recipient semantics are verified |
| V04 | Refund behavior: address formats, refund types, expiry, status, tx proof | Customer fund safety | Require validated payer-controlled refund destination; never default to freelancer |
| V05 | Underpayment, repeated deposits, oversends, multiple attempts and recovery rules | Correct ledger/status | One attempt per quote; preserve attempts; add manual-safe error paths |
| V06 | Partner JWT issuance, rate limits and real quote charges | Real availability/budget | Server-side proxy; graceful failures and limit requests |
| V07 | Secure freelancer login and authorization flow | Privacy and ownership | Local fixtures only until access model chosen |
| V08 | Exact relayer contract, permitted methods, gas caps, wallet signing and account funding | Prevents open gas subsidy | No public relayer endpoint by default |
| V09 | Provider-to-chain proof verification and transaction finality | Avoids false 'Paid' | Record provider `SUCCESS`, then reconcile against available verified settlement evidence |
| V10 | Network explorer links, correct chain URL encoding | Honest drill-down | Only render links from verified chain-specific mapping |
| V11 | Partner revenue/fee sharing eligibility | Business model | Claim no fee-based revenue |
| V12 | Cashing USDC on NEAR out to fiat | Real-world utility | State that cash-out is not implemented |

## Integration design rules

1. **Backend only:** JWT, quote creation, raw provider status, status reconciliation, and any signed relay transaction. All external calls use validated inputs, timeouts and bounded retries.
2. **Adapters:** Implement `OneClickProvider` and a deterministic fixture provider with the same typed contract. Every fixture response MUST carry `mode: 'fixture'`; production UIs must clearly distinguish it.
3. **No hallucinated evidence:** Provider status isn't identical to a verified chain transaction. Do not fill absent fields with example hashes, default timestamps or fake amounts.
4. **Never use a public backend as an unrestricted relay.** On the relayer validate signer, intended receiver, allowed actions/methods, nonce/expiry, deposit/gas cap, and rate limit; reject unknown calls.
5. **Base-unit correctness:** Convert using the supported token's reported decimals and bigint/string integers. Do not convert crypto amounts with floating point arithmetic.
6. **Privacy:** Share-slug endpoints expose only invoice fields intended for clients; never return provider JWT, relayer keys, private account settings or other users' invoices.
7. **Reconciliation:** Poll by persisted quote `depositAddress`; dedupe updates and avoid decrementing paid status because of stale responses.
8. **Observability:** Log sanitized request IDs and status transitions without private keys, bearer tokens, full sensitive account data or raw deposit instructions unnecessarily.
9. **Security:** Backend authentication and idempotent quote creation are required; prevent forged callbacks, SSRF and arbitrary-origin requests; apply CSRF/origin protection as appropriate to authenticated mutations.

## Suggested environment variables (names are proposals; sync with code)

```dotenv
# Server only
ONECLICK_API_BASE_URL=https://1click.chaindefuser.com
ONECLICK_API_JWT=
DATABASE_URL=
SESSION_SECRET=
NEAR_NETWORK=testnet
NEAR_RPC_URL=
NEAR_RELAYER_ACCOUNT_ID=
NEAR_RELAYER_PRIVATE_KEY=
NEAR_ALLOWED_CONTRACT_ID=

# Public
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Do not fill real secrets into `.env.example` or the repository. `NEAR_NETWORK=testnet` configures any separate NEAR/testnet relayer functionality; **it does not move 1Click to testnet**.

## Verification protocol

For every V-item: capture date, source URL, redacted test input, redacted actual output, inferred UI mapping, tests, and the commit that changes this file from VERIFY to Verified. Never change claims merely because an assistant or tutorial example suggested them. Check live documentation again just before paid demo.
