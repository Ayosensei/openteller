CREATE TYPE "public"."payment_attempt_mode" AS ENUM('fixture', 'live');--> statement-breakpoint
CREATE TYPE "public"."payment_evidence_kind" AS ENUM('origin', 'destination', 'refund');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('open', 'pending', 'paid', 'underpaid', 'refunded', 'void');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_subject" text NOT NULL,
	"near_account_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoice_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"payment_attempt_id" uuid,
	"event_type" text NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"source" text NOT NULL,
	"source_event_key" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoice_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"description" text NOT NULL,
	"quantity_value" bigint NOT NULL,
	"quantity_scale" smallint NOT NULL,
	"unit_price_minor" bigint NOT NULL,
	"line_total_minor" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"public_slug" text NOT NULL,
	"invoice_number" text NOT NULL,
	"client_name" text NOT NULL,
	"issued_at" date NOT NULL,
	"due_at" date NOT NULL,
	"notes" text,
	"currency" text DEFAULT 'USDC' NOT NULL,
	"total_minor" bigint NOT NULL,
	"recipient_near_account" text NOT NULL,
	"status" "invoice_status" DEFAULT 'open' NOT NULL,
	"voided_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"provider" text DEFAULT '1click' NOT NULL,
	"mode" "payment_attempt_mode" NOT NULL,
	"provider_status" text NOT NULL,
	"ui_status" text NOT NULL,
	"correlation_id" text,
	"deposit_address" text,
	"deposit_memo" text,
	"origin_asset_id" text NOT NULL,
	"destination_asset_id" text NOT NULL,
	"origin_chain" text NOT NULL,
	"quoted_origin_base_units" text,
	"requested_destination_base_units" text NOT NULL,
	"refund_destination" text NOT NULL,
	"quoted_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone,
	"confirmed_at" timestamp with time zone,
	"received_destination_base_units" text,
	"raw_provider_response" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_attempt_id" uuid NOT NULL,
	"kind" "payment_evidence_kind" NOT NULL,
	"chain" text NOT NULL,
	"tx_hash" text NOT NULL,
	"explorer_url" text,
	"amount_base_units" text,
	"asset_id" text,
	"observed_at" timestamp with time zone,
	"verified_at" timestamp with time zone,
	"evidence_source" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invoice_events" ADD CONSTRAINT "invoice_events_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_events" ADD CONSTRAINT "invoice_events_payment_attempt_id_payment_attempts_id_fk" FOREIGN KEY ("payment_attempt_id") REFERENCES "public"."payment_attempts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_owner_id_accounts_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_attempts" ADD CONSTRAINT "payment_attempts_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_evidence" ADD CONSTRAINT "payment_evidence_payment_attempt_id_payment_attempts_id_fk" FOREIGN KEY ("payment_attempt_id") REFERENCES "public"."payment_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_auth_subject_uidx" ON "accounts" USING btree ("auth_subject");--> statement-breakpoint
CREATE INDEX "invoice_events_invoice_occurred_idx" ON "invoice_events" USING btree ("invoice_id","occurred_at");--> statement-breakpoint
CREATE UNIQUE INDEX "invoice_events_source_key_uidx" ON "invoice_events" USING btree ("source_event_key");--> statement-breakpoint
CREATE UNIQUE INDEX "invoice_items_position_uidx" ON "invoice_items" USING btree ("invoice_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "invoices_public_slug_uidx" ON "invoices" USING btree ("public_slug");--> statement-breakpoint
CREATE UNIQUE INDEX "invoices_owner_number_uidx" ON "invoices" USING btree ("owner_id","invoice_number");--> statement-breakpoint
CREATE INDEX "invoices_owner_created_idx" ON "invoices" USING btree ("owner_id","created_at");--> statement-breakpoint
CREATE INDEX "payment_attempts_invoice_created_idx" ON "payment_attempts" USING btree ("invoice_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_attempts_deposit_address_uidx" ON "payment_attempts" USING btree ("deposit_address");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_evidence_attempt_kind_hash_uidx" ON "payment_evidence" USING btree ("payment_attempt_id","kind","tx_hash");