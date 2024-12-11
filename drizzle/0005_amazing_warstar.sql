CREATE TABLE IF NOT EXISTS "form_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"thumbnail_url" text,
	"elements" json NOT NULL,
	"settings" json NOT NULL,
	"is_public" boolean DEFAULT false,
	"user_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "template_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"slug" text NOT NULL,
	"order_index" integer NOT NULL,
	CONSTRAINT "template_categories_slug_unique" UNIQUE("slug")
);
