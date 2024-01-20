import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `${name}`);

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("createdById", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const subscriptions = createTable("subscription", {
  userId: varchar("user_id", { length: 255 }).unique(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).unique(),
  stripeSubscriptionId: varchar("stripe_subscription_id", {
    length: 255,
  })
    .unique()
    .primaryKey(),
  stripePriceId: varchar("stripe_price_id", { length: 255 }),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
});

// export const postsRelations = relations(posts, ({ one }) => ({
//   tenant: one(tenants, {
//     fields: [posts.createdById],
//     references: [tenants.id],
//   }),
// }));

// export const tenants = createTable("tenant", {
//   id: varchar("id", { length: 255 }).notNull().primaryKey(),
//   email: varchar("email", { length: 255 }).notNull(),
//   fullName: varchar("fullName", { length: 255 }).notNull(),
// });

// export const tenantsRelations = relations(tenants, ({ many }) => ({
//   accounts: many(accounts),
//   sessions: many(sessions),
// }));

// export const accounts = createTable(
//   "account",
//   {
//     userId: varchar("userId", { length: 255 })
//       .notNull()
//       .references(() => tenants.id),
//     provider: varchar("provider", { length: 255 }).notNull(),
//     providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
//     refresh_token: text("refresh_token"),
//     access_token: text("access_token"),
//     expires_at: integer("expires_at"),
//     token_type: varchar("token_type", { length: 255 }),
//     scope: varchar("scope", { length: 255 }),
//     id_token: text("id_token"),
//     session_state: varchar("session_state", { length: 255 }),
//   },
//   (account) => ({
//     compoundKey: primaryKey({
//       columns: [account.provider, account.providerAccountId],
//     }),
//     userIdIdx: index("account_userId_idx").on(account.userId),
//   }),
// );

// export const accountsRelations = relations(accounts, ({ one }) => ({
//   tenant: one(tenants, { fields: [accounts.userId], references: [tenants.id] }),
// }));

// export const sessions = createTable(
//   "session",
//   {
//     sessionToken: varchar("sessionToken", { length: 255 })
//       .notNull()
//       .primaryKey(),
//     userId: varchar("userId", { length: 255 })
//       .notNull()
//       .references(() => tenants.id),
//     expires: timestamp("expires", { mode: "date" }).notNull(),
//   },
//   (session) => ({
//     userIdIdx: index("session_userId_idx").on(session.userId),
//   }),
// );

// export const sessionsRelations = relations(sessions, ({ one }) => ({
//   tenant: one(tenants, { fields: [sessions.userId], references: [tenants.id] }),
// }));
