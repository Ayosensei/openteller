import {
  bigint,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const invoiceStatus = pgEnum("invoice_status", [
  "open",
  "pending",
  "paid",
  "underpaid",
  "refunded",
  "void",
]);

export const attemptMode = pgEnum("payment_attempt_mode", ["fixture", "live"]);
export const evidenceKind = pgEnum("payment_evidence_kind", [
  "origin",
  "destination",
  "refund",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    authSubject: text("auth_subject").notNull(),
    nearAccountId: text("near_account_id"),
    ...timestamps,
  },
  (table) => [uniqueIndex("accounts_auth_subject_uidx").on(table.authSubject)],
);

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "restrict" }),
    publicSlug: text("public_slug").notNull(),
    invoiceNumber: text("invoice_number").notNull(),
    clientName: text("client_name").notNull(),
    issuedAt: date("issued_at", { mode: "string" }).notNull(),
    dueAt: date("due_at", { mode: "string" }).notNull(),
    notes: text("notes"),
    currency: text("currency").default("USDC").notNull(),
    totalMinor: bigint("total_minor", { mode: "bigint" }).notNull(),
    recipientNearAccount: text("recipient_near_account").notNull(),
    status: invoiceStatus("status").default("open").notNull(),
    voidedAt: timestamp("voided_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("invoices_public_slug_uidx").on(table.publicSlug),
    uniqueIndex("invoices_owner_number_uidx").on(
      table.ownerId,
      table.invoiceNumber,
    ),
    index("invoices_owner_created_idx").on(table.ownerId, table.createdAt),
  ],
);

export const invoiceItems = pgTable(
  "invoice_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    invoiceId: uuid("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    description: text("description").notNull(),
    quantityValue: bigint("quantity_value", { mode: "bigint" }).notNull(),
    quantityScale: smallint("quantity_scale").notNull(),
    unitPriceMinor: bigint("unit_price_minor", { mode: "bigint" }).notNull(),
    lineTotalMinor: bigint("line_total_minor", { mode: "bigint" }).notNull(),
  },
  (table) => [
    uniqueIndex("invoice_items_position_uidx").on(
      table.invoiceId,
      table.position,
    ),
  ],
);

export const paymentAttempts = pgTable(
  "payment_attempts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    invoiceId: uuid("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "restrict" }),
    provider: text("provider").default("1click").notNull(),
    mode: attemptMode("mode").notNull(),
    providerStatus: text("provider_status").notNull(),
    uiStatus: text("ui_status").notNull(),
    correlationId: text("correlation_id"),
    depositAddress: text("deposit_address"),
    depositMemo: text("deposit_memo"),
    originAssetId: text("origin_asset_id").notNull(),
    destinationAssetId: text("destination_asset_id").notNull(),
    originChain: text("origin_chain").notNull(),
    quotedOriginBaseUnits: text("quoted_origin_base_units"),
    requestedDestinationBaseUnits: text(
      "requested_destination_base_units",
    ).notNull(),
    refundDestination: text("refund_destination").notNull(),
    quotedAt: timestamp("quoted_at", { withTimezone: true }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    receivedDestinationBaseUnits: text("received_destination_base_units"),
    rawProviderResponse: jsonb("raw_provider_response"),
    ...timestamps,
  },
  (table) => [
    index("payment_attempts_invoice_created_idx").on(
      table.invoiceId,
      table.createdAt,
    ),
    uniqueIndex("payment_attempts_deposit_address_uidx").on(
      table.depositAddress,
    ),
  ],
);

export const paymentEvidence = pgTable(
  "payment_evidence",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    paymentAttemptId: uuid("payment_attempt_id")
      .notNull()
      .references(() => paymentAttempts.id, { onDelete: "cascade" }),
    kind: evidenceKind("kind").notNull(),
    chain: text("chain").notNull(),
    txHash: text("tx_hash").notNull(),
    explorerUrl: text("explorer_url"),
    amountBaseUnits: text("amount_base_units"),
    assetId: text("asset_id"),
    observedAt: timestamp("observed_at", { withTimezone: true }),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    evidenceSource: text("evidence_source").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("payment_evidence_attempt_kind_hash_uidx").on(
      table.paymentAttemptId,
      table.kind,
      table.txHash,
    ),
  ],
);

export const invoiceEvents = pgTable(
  "invoice_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    invoiceId: uuid("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "restrict" }),
    paymentAttemptId: uuid("payment_attempt_id").references(
      () => paymentAttempts.id,
      { onDelete: "restrict" },
    ),
    eventType: text("event_type").notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    source: text("source").notNull(),
    sourceEventKey: text("source_event_key"),
    metadata: jsonb("metadata").default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("invoice_events_invoice_occurred_idx").on(
      table.invoiceId,
      table.occurredAt,
    ),
    uniqueIndex("invoice_events_source_key_uidx").on(table.sourceEventKey),
  ],
);
