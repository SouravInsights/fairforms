import { FormSettings } from "@/types/form";
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
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  elements: json("elements").$type<FormElement[]>().notNull(),
  settings: json("settings").$type<FormSettings>().notNull(),
  customSlug: text("custom_slug").unique(),
});

export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  formId: integer("form_id").references(() => forms.id),
  answers: json("answers").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
});
