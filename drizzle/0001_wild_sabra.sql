ALTER TABLE "invoices" ADD COLUMN "submission_key" uuid NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "invoices_owner_submission_uidx" ON "invoices" USING btree ("owner_id","submission_key");