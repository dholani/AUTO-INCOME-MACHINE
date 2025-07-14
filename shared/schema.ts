import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const affiliateAccounts = pgTable("affiliate_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  platform: text("platform").notNull(), // earnkaro, admitad, impact, jvzoo, warriorplus, clickbank
  accountId: text("account_id").notNull(),
  apiKey: text("api_key"),
  secretKey: text("secret_key"),
  status: text("status").notNull().default("active"), // active, inactive, pending
  earnings: integer("earnings").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  platform: text("platform").notNull(), // facebook, twitter, linkedin, instagram
  accountId: text("account_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  status: text("status").notNull().default("connected"), // connected, disconnected, expired
  followers: integer("followers").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"), // draft, active, paused, completed
  affiliateAccountId: integer("affiliate_account_id").references(() => affiliateAccounts.id),
  productUrl: text("product_url"),
  commission: integer("commission").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contentTemplates = pgTable("content_templates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  platform: text("platform").notNull(), // facebook, twitter, linkedin, instagram
  mediaUrls: text("media_urls").array(),
  hashtags: text("hashtags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scheduledPosts = pgTable("scheduled_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  contentTemplateId: integer("content_template_id").references(() => contentTemplates.id),
  socialAccountId: integer("social_account_id").references(() => socialAccounts.id).notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  status: text("status").notNull().default("pending"), // pending, posted, failed, cancelled
  postId: text("post_id"), // ID from social platform after posting
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  originalUrl: text("original_url").notNull(),
  shortUrl: text("short_url").notNull().unique(),
  clicks: integer("clicks").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  socialAccountId: integer("social_account_id").references(() => socialAccounts.id),
  postId: integer("post_id").references(() => scheduledPosts.id),
  metric: text("metric").notNull(), // clicks, impressions, engagement, conversions
  value: integer("value").notNull(),
  date: timestamp("date").notNull(),
});

export const automationSettings = pgTable("automation_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  autoPost: boolean("auto_post").default(true),
  smartScheduling: boolean("smart_scheduling").default(true),
  autoRetry: boolean("auto_retry").default(false),
  retryAttempts: integer("retry_attempts").default(3),
  settings: json("settings"), // Additional automation settings
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  affiliateAccounts: many(affiliateAccounts),
  socialAccounts: many(socialAccounts),
  campaigns: many(campaigns),
  contentTemplates: many(contentTemplates),
  scheduledPosts: many(scheduledPosts),
  links: many(links),
  analytics: many(analytics),
  automationSettings: many(automationSettings),
}));

export const affiliateAccountsRelations = relations(affiliateAccounts, ({ one, many }) => ({
  user: one(users, {
    fields: [affiliateAccounts.userId],
    references: [users.id],
  }),
  campaigns: many(campaigns),
}));

export const socialAccountsRelations = relations(socialAccounts, ({ one, many }) => ({
  user: one(users, {
    fields: [socialAccounts.userId],
    references: [users.id],
  }),
  scheduledPosts: many(scheduledPosts),
  analytics: many(analytics),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  user: one(users, {
    fields: [campaigns.userId],
    references: [users.id],
  }),
  affiliateAccount: one(affiliateAccounts, {
    fields: [campaigns.affiliateAccountId],
    references: [affiliateAccounts.id],
  }),
  contentTemplates: many(contentTemplates),
  scheduledPosts: many(scheduledPosts),
  links: many(links),
  analytics: many(analytics),
}));

export const contentTemplatesRelations = relations(contentTemplates, ({ one, many }) => ({
  user: one(users, {
    fields: [contentTemplates.userId],
    references: [users.id],
  }),
  campaign: one(campaigns, {
    fields: [contentTemplates.campaignId],
    references: [campaigns.id],
  }),
  scheduledPosts: many(scheduledPosts),
}));

export const scheduledPostsRelations = relations(scheduledPosts, ({ one }) => ({
  user: one(users, {
    fields: [scheduledPosts.userId],
    references: [users.id],
  }),
  campaign: one(campaigns, {
    fields: [scheduledPosts.campaignId],
    references: [campaigns.id],
  }),
  contentTemplate: one(contentTemplates, {
    fields: [scheduledPosts.contentTemplateId],
    references: [contentTemplates.id],
  }),
  socialAccount: one(socialAccounts, {
    fields: [scheduledPosts.socialAccountId],
    references: [socialAccounts.id],
  }),
}));

export const linksRelations = relations(links, ({ one }) => ({
  user: one(users, {
    fields: [links.userId],
    references: [users.id],
  }),
  campaign: one(campaigns, {
    fields: [links.campaignId],
    references: [campaigns.id],
  }),
}));

export const analyticsRelations = relations(analytics, ({ one }) => ({
  user: one(users, {
    fields: [analytics.userId],
    references: [users.id],
  }),
  campaign: one(campaigns, {
    fields: [analytics.campaignId],
    references: [campaigns.id],
  }),
  socialAccount: one(socialAccounts, {
    fields: [analytics.socialAccountId],
    references: [socialAccounts.id],
  }),
  post: one(scheduledPosts, {
    fields: [analytics.postId],
    references: [scheduledPosts.id],
  }),
}));

export const automationSettingsRelations = relations(automationSettings, ({ one }) => ({
  user: one(users, {
    fields: [automationSettings.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertAffiliateAccountSchema = createInsertSchema(affiliateAccounts).omit({ id: true, createdAt: true });
export const insertSocialAccountSchema = createInsertSchema(socialAccounts).omit({ id: true, createdAt: true });
export const insertCampaignSchema = createInsertSchema(campaigns).omit({ id: true, createdAt: true });
export const insertContentTemplateSchema = createInsertSchema(contentTemplates).omit({ id: true, createdAt: true });
export const insertScheduledPostSchema = createInsertSchema(scheduledPosts).omit({ id: true, createdAt: true });
export const insertLinkSchema = createInsertSchema(links).omit({ id: true, createdAt: true });
export const insertAnalyticsSchema = createInsertSchema(analytics).omit({ id: true });
export const insertAutomationSettingsSchema = createInsertSchema(automationSettings).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type AffiliateAccount = typeof affiliateAccounts.$inferSelect;
export type InsertAffiliateAccount = z.infer<typeof insertAffiliateAccountSchema>;
export type SocialAccount = typeof socialAccounts.$inferSelect;
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type ContentTemplate = typeof contentTemplates.$inferSelect;
export type InsertContentTemplate = z.infer<typeof insertContentTemplateSchema>;
export type ScheduledPost = typeof scheduledPosts.$inferSelect;
export type InsertScheduledPost = z.infer<typeof insertScheduledPostSchema>;
export type Link = typeof links.$inferSelect;
export type InsertLink = z.infer<typeof insertLinkSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type AutomationSettings = typeof automationSettings.$inferSelect;
export type InsertAutomationSettings = z.infer<typeof insertAutomationSettingsSchema>;
