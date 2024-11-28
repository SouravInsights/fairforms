import { FormElement, FormSettings } from "@/types/form";
import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  json,
  integer,
} from "drizzle-orm/pg-core";

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
});

export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  formId: integer("form_id")
    .references(() => forms.id)
    .notNull(),
  answers: json("answers").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const collaborators = pgTable("collaborators", {
  id: serial("id").primaryKey(),
  formId: serial("form_id").references(() => forms.id),
  userId: text("user_id").notNull(),
  role: text("role").notNull(), // 'editor' | 'viewer'
  addedAt: timestamp("added_at").defaultNow(),
});
