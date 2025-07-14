import { 
  users, affiliateAccounts, socialAccounts, campaigns, contentTemplates, 
  scheduledPosts, links, analytics, automationSettings,
  type User, type InsertUser, type AffiliateAccount, type InsertAffiliateAccount,
  type SocialAccount, type InsertSocialAccount, type Campaign, type InsertCampaign,
  type ContentTemplate, type InsertContentTemplate, type ScheduledPost, type InsertScheduledPost,
  type Link, type InsertLink, type Analytics, type InsertAnalytics,
  type AutomationSettings, type InsertAutomationSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Affiliate Account operations
  getAffiliateAccounts(userId: number): Promise<AffiliateAccount[]>;
  createAffiliateAccount(account: InsertAffiliateAccount): Promise<AffiliateAccount>;
  updateAffiliateAccount(id: number, account: Partial<AffiliateAccount>): Promise<AffiliateAccount>;
  deleteAffiliateAccount(id: number): Promise<void>;

  // Social Account operations
  getSocialAccounts(userId: number): Promise<SocialAccount[]>;
  createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount>;
  updateSocialAccount(id: number, account: Partial<SocialAccount>): Promise<SocialAccount>;
  deleteSocialAccount(id: number): Promise<void>;

  // Campaign operations
  getCampaigns(userId: number): Promise<Campaign[]>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaign: Partial<Campaign>): Promise<Campaign>;
  deleteCampaign(id: number): Promise<void>;

  // Content Template operations
  getContentTemplates(userId: number): Promise<ContentTemplate[]>;
  createContentTemplate(template: InsertContentTemplate): Promise<ContentTemplate>;
  updateContentTemplate(id: number, template: Partial<ContentTemplate>): Promise<ContentTemplate>;
  deleteContentTemplate(id: number): Promise<void>;

  // Scheduled Post operations
  getScheduledPosts(userId: number): Promise<ScheduledPost[]>;
  getUpcomingPosts(userId: number): Promise<ScheduledPost[]>;
  createScheduledPost(post: InsertScheduledPost): Promise<ScheduledPost>;
  updateScheduledPost(id: number, post: Partial<ScheduledPost>): Promise<ScheduledPost>;
  deleteScheduledPost(id: number): Promise<void>;

  // Link operations
  getLinks(userId: number): Promise<Link[]>;
  createLink(link: InsertLink): Promise<Link>;
  updateLink(id: number, link: Partial<Link>): Promise<Link>;
  deleteLink(id: number): Promise<void>;

  // Analytics operations
  getAnalytics(userId: number): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getDashboardStats(userId: number): Promise<{
    totalPosts: number;
    activeCampaigns: number;
    clickRate: number;
    revenue: number;
  }>;

  // Automation Settings operations
  getAutomationSettings(userId: number): Promise<AutomationSettings | undefined>;
  createAutomationSettings(settings: InsertAutomationSettings): Promise<AutomationSettings>;
  updateAutomationSettings(userId: number, settings: Partial<AutomationSettings>): Promise<AutomationSettings>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAffiliateAccounts(userId: number): Promise<AffiliateAccount[]> {
    return await db.select().from(affiliateAccounts).where(eq(affiliateAccounts.userId, userId));
  }

  async createAffiliateAccount(account: InsertAffiliateAccount): Promise<AffiliateAccount> {
    const [newAccount] = await db.insert(affiliateAccounts).values(account).returning();
    return newAccount;
  }

  async updateAffiliateAccount(id: number, account: Partial<AffiliateAccount>): Promise<AffiliateAccount> {
    const [updatedAccount] = await db.update(affiliateAccounts).set(account).where(eq(affiliateAccounts.id, id)).returning();
    return updatedAccount;
  }

  async deleteAffiliateAccount(id: number): Promise<void> {
    await db.delete(affiliateAccounts).where(eq(affiliateAccounts.id, id));
  }

  async getSocialAccounts(userId: number): Promise<SocialAccount[]> {
    return await db.select().from(socialAccounts).where(eq(socialAccounts.userId, userId));
  }

  async createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount> {
    const [newAccount] = await db.insert(socialAccounts).values(account).returning();
    return newAccount;
  }

  async updateSocialAccount(id: number, account: Partial<SocialAccount>): Promise<SocialAccount> {
    const [updatedAccount] = await db.update(socialAccounts).set(account).where(eq(socialAccounts.id, id)).returning();
    return updatedAccount;
  }

  async deleteSocialAccount(id: number): Promise<void> {
    await db.delete(socialAccounts).where(eq(socialAccounts.id, id));
  }

  async getCampaigns(userId: number): Promise<Campaign[]> {
    return await db.select().from(campaigns).where(eq(campaigns.userId, userId)).orderBy(desc(campaigns.createdAt));
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign || undefined;
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [newCampaign] = await db.insert(campaigns).values(campaign).returning();
    return newCampaign;
  }

  async updateCampaign(id: number, campaign: Partial<Campaign>): Promise<Campaign> {
    const [updatedCampaign] = await db.update(campaigns).set(campaign).where(eq(campaigns.id, id)).returning();
    return updatedCampaign;
  }

  async deleteCampaign(id: number): Promise<void> {
    await db.delete(campaigns).where(eq(campaigns.id, id));
  }

  async getContentTemplates(userId: number): Promise<ContentTemplate[]> {
    return await db.select().from(contentTemplates).where(eq(contentTemplates.userId, userId));
  }

  async createContentTemplate(template: InsertContentTemplate): Promise<ContentTemplate> {
    const [newTemplate] = await db.insert(contentTemplates).values(template).returning();
    return newTemplate;
  }

  async updateContentTemplate(id: number, template: Partial<ContentTemplate>): Promise<ContentTemplate> {
    const [updatedTemplate] = await db.update(contentTemplates).set(template).where(eq(contentTemplates.id, id)).returning();
    return updatedTemplate;
  }

  async deleteContentTemplate(id: number): Promise<void> {
    await db.delete(contentTemplates).where(eq(contentTemplates.id, id));
  }

  async getScheduledPosts(userId: number): Promise<ScheduledPost[]> {
    return await db.select().from(scheduledPosts).where(eq(scheduledPosts.userId, userId)).orderBy(desc(scheduledPosts.scheduledAt));
  }

  async getUpcomingPosts(userId: number): Promise<ScheduledPost[]> {
    const now = new Date();
    return await db.select().from(scheduledPosts)
      .where(and(
        eq(scheduledPosts.userId, userId),
        eq(scheduledPosts.status, 'pending')
      ))
      .orderBy(scheduledPosts.scheduledAt)
      .limit(10);
  }

  async createScheduledPost(post: InsertScheduledPost): Promise<ScheduledPost> {
    const [newPost] = await db.insert(scheduledPosts).values(post).returning();
    return newPost;
  }

  async updateScheduledPost(id: number, post: Partial<ScheduledPost>): Promise<ScheduledPost> {
    const [updatedPost] = await db.update(scheduledPosts).set(post).where(eq(scheduledPosts.id, id)).returning();
    return updatedPost;
  }

  async deleteScheduledPost(id: number): Promise<void> {
    await db.delete(scheduledPosts).where(eq(scheduledPosts.id, id));
  }

  async getLinks(userId: number): Promise<Link[]> {
    return await db.select().from(links).where(eq(links.userId, userId));
  }

  async createLink(link: InsertLink): Promise<Link> {
    const [newLink] = await db.insert(links).values(link).returning();
    return newLink;
  }

  async updateLink(id: number, link: Partial<Link>): Promise<Link> {
    const [updatedLink] = await db.update(links).set(link).where(eq(links.id, id)).returning();
    return updatedLink;
  }

  async deleteLink(id: number): Promise<void> {
    await db.delete(links).where(eq(links.id, id));
  }

  async getAnalytics(userId: number): Promise<Analytics[]> {
    return await db.select().from(analytics).where(eq(analytics.userId, userId));
  }

  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const [newAnalytics] = await db.insert(analytics).values(analyticsData).returning();
    return newAnalytics;
  }

  async getDashboardStats(userId: number): Promise<{
    totalPosts: number;
    activeCampaigns: number;
    clickRate: number;
    revenue: number;
  }> {
    // Get total posts count
    const postsResult = await db.select().from(scheduledPosts).where(eq(scheduledPosts.userId, userId));
    const totalPosts = postsResult.length;

    // Get active campaigns count
    const campaignsResult = await db.select().from(campaigns).where(and(eq(campaigns.userId, userId), eq(campaigns.status, 'active')));
    const activeCampaigns = campaignsResult.length;

    // Calculate click rate (simplified)
    const linksResult = await db.select().from(links).where(eq(links.userId, userId));
    const totalClicks = linksResult.reduce((sum, link) => sum + (link.clicks || 0), 0);
    const clickRate = totalPosts > 0 ? (totalClicks / totalPosts) : 0;

    // Calculate revenue from affiliate accounts
    const affiliateResult = await db.select().from(affiliateAccounts).where(eq(affiliateAccounts.userId, userId));
    const revenue = affiliateResult.reduce((sum, account) => sum + (account.earnings || 0), 0);

    return {
      totalPosts,
      activeCampaigns,
      clickRate: Math.round(clickRate * 100) / 100,
      revenue
    };
  }

  async getAutomationSettings(userId: number): Promise<AutomationSettings | undefined> {
    const [settings] = await db.select().from(automationSettings).where(eq(automationSettings.userId, userId));
    return settings || undefined;
  }

  async createAutomationSettings(settings: InsertAutomationSettings): Promise<AutomationSettings> {
    const [newSettings] = await db.insert(automationSettings).values(settings).returning();
    return newSettings;
  }

  async updateAutomationSettings(userId: number, settings: Partial<AutomationSettings>): Promise<AutomationSettings> {
    const [updatedSettings] = await db.update(automationSettings).set(settings).where(eq(automationSettings.userId, userId)).returning();
    return updatedSettings;
  }
}

export const storage = new DatabaseStorage();
