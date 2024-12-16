ALTER TABLE "collaborators" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "collaborators" ADD COLUMN "added_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "collaborators" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "collaborators" ADD COLUMN "accepted_at" timestamp;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_collaborator_idx" ON "collaborators" USING btree ("form_id","user_id");