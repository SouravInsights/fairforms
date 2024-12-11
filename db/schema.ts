import { FormElement, FormSettings } from "@/types/form";
import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  json,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const forms = pgTable("forms", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  elements: json("elements").$type<FormElement[]>().notNull(),
  settings: json("settings").$type<FormSettings>().notNull(),
  isPublished: boolean("is_published").default(false),
  customSlug: text("custom_slug").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  socialImageUrl: text("social_image_url"),
});

export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  formId: integer("form_id")
    .references(() => forms.id)
    .notNull(),
  answers: json("answers").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  // Add web3 fields
  walletAddress: text("wallet_address"),
  transactionHash: text("transaction_hash"),
  rewardClaimed: boolean("reward_claimed").default(false),
  chainId: integer("chain_id"),
});

export const collaborators = pgTable("collaborators", {
  id: serial("id").primaryKey(),
  formId: serial("form_id").references(() => forms.id),
  userId: text("user_id").notNull(),
  role: text("role").notNull(), // 'editor' | 'viewer'
  addedAt: timestamp("added_at").defaultNow(),
});

export const waitlistTable = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  referralCode: text("referral_code").notNull().unique(),
  position: integer("position").notNull(),
  referredBy: text("referred_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const waitlistRelations = relations(waitlistTable, ({ one }) => ({
  referrer: one(waitlistTable, {
    fields: [waitlistTable.referredBy],
    references: [waitlistTable.referralCode],
  }),
}));

// Schemas for validation
export const insertWaitlistSchema = createInsertSchema(waitlistTable);
export const selectWaitlistSchema = createSelectSchema(waitlistTable);

export type WaitlistEntry = z.infer<typeof selectWaitlistSchema>;
export type NewWaitlistEntry = z.infer<typeof insertWaitlistSchema>;

export const formTemplates = pgTable("form_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  thumbnail: text("thumbnail_url"),
  elements: json("elements").$type<FormElement[]>().notNull(),
  settings: json("settings").$type<FormSettings>().notNull(),
  isPublic: boolean("is_public").default(false),
  userId: text("user_id"), // null for system templates
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const templateCategories = pgTable("template_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  orderIndex: integer("order_index").notNull(),
});

export const templateRelations = relations(formTemplates, ({ one }) => ({
  category: one(templateCategories, {
    fields: [formTemplates.category],
    references: [templateCategories.slug],
  }),
}));

export type FormTemplate = typeof formTemplates.$inferSelect;
export type NewFormTemplate = typeof formTemplates.$inferInsert;
export type TemplateCategory = typeof templateCategories.$inferSelect;
