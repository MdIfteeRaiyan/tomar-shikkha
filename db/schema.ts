import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const practiceAttempts = sqliteTable(
  "practice_attempts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull(),
    subject: text("subject").notNull(),
    chapter: text("chapter").notNull(),
    score: integer("score").notNull(),
    total: integer("total").notNull(),
    focusArea: text("focus_area").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [index("idx_practice_attempts_user_created").on(table.userId, table.createdAt)],
);
