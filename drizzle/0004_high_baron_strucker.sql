ALTER TABLE "responses" ADD COLUMN "wallet_address" text;--> statement-breakpoint
ALTER TABLE "responses" ADD COLUMN "transaction_hash" text;--> statement-breakpoint
ALTER TABLE "responses" ADD COLUMN "reward_claimed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "responses" ADD COLUMN "chain_id" integer;