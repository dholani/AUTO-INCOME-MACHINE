import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertAffiliateAccountSchema, insertSocialAccountSchema, insertCampaignSchema,
  insertContentTemplateSchema, insertScheduledPostSchema, insertLinkSchema,
  insertAnalyticsSchema, insertAutomationSettingsSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock user ID for now (in production, this would come from authentication)
  const MOCK_USER_ID = 1;

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats(MOCK_USER_ID);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Affiliate Accounts
  app.get("/api/affiliate-accounts", async (req, res) => {
    try {
      const accounts = await storage.getAffiliateAccounts(MOCK_USER_ID);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch affiliate accounts" });
    }
  });

  app.post("/api/affiliate-accounts", async (req, res) => {
    try {
      const accountData = insertAffiliateAccountSchema.parse({ ...req.body, userId: MOCK_USER_ID });
      const account = await storage.createAffiliateAccount(accountData);
      res.json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create affiliate account" });
    }
  });

  app.put("/api/affiliate-accounts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const account = await storage.updateAffiliateAccount(id, req.body);
      res.json(account);
    } catch (error) {
      res.status(500).json({ error: "Failed to update affiliate account" });
    }
  });

  app.delete("/api/affiliate-accounts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAffiliateAccount(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete affiliate account" });
    }
  });

  // Social Accounts
  app.get("/api/social-accounts", async (req, res) => {
    try {
      const accounts = await storage.getSocialAccounts(MOCK_USER_ID);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch social accounts" });
    }
  });

  app.post("/api/social-accounts", async (req, res) => {
    try {
      const accountData = insertSocialAccountSchema.parse({ ...req.body, userId: MOCK_USER_ID });
      const account = await storage.createSocialAccount(accountData);
      res.json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create social account" });
    }
  });

  app.put("/api/social-accounts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const account = await storage.updateSocialAccount(id, req.body);
      res.json(account);
    } catch (error) {
      res.status(500).json({ error: "Failed to update social account" });
    }
  });

  app.delete("/api/social-accounts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSocialAccount(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete social account" });
    }
  });

  // Campaigns
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns(MOCK_USER_ID);
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch campaign" });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const campaignData = insertCampaignSchema.parse({ ...req.body, userId: MOCK_USER_ID });
      const campaign = await storage.createCampaign(campaignData);
      res.json(campaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create campaign" });
    }
  });

  app.put("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.updateCampaign(id, req.body);
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: "Failed to update campaign" });
    }
  });

  app.delete("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCampaign(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete campaign" });
    }
  });

  // Content Templates
  app.get("/api/content-templates", async (req, res) => {
    try {
      const templates = await storage.getContentTemplates(MOCK_USER_ID);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content templates" });
    }
  });

  app.post("/api/content-templates", async (req, res) => {
    try {
      const templateData = insertContentTemplateSchema.parse({ ...req.body, userId: MOCK_USER_ID });
      const template = await storage.createContentTemplate(templateData);
      res.json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create content template" });
    }
  });

  app.put("/api/content-templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.updateContentTemplate(id, req.body);
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to update content template" });
    }
  });

  app.delete("/api/content-templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteContentTemplate(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete content template" });
    }
  });

  // Scheduled Posts
  app.get("/api/scheduled-posts", async (req, res) => {
    try {
      const posts = await storage.getScheduledPosts(MOCK_USER_ID);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch scheduled posts" });
    }
  });

  app.get("/api/scheduled-posts/upcoming", async (req, res) => {
    try {
      const posts = await storage.getUpcomingPosts(MOCK_USER_ID);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch upcoming posts" });
    }
  });

  app.post("/api/scheduled-posts", async (req, res) => {
    try {
      const postData = insertScheduledPostSchema.parse({ ...req.body, userId: MOCK_USER_ID });
      const post = await storage.createScheduledPost(postData);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create scheduled post" });
    }
  });

  app.put("/api/scheduled-posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.updateScheduledPost(id, req.body);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to update scheduled post" });
    }
  });

  app.delete("/api/scheduled-posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteScheduledPost(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete scheduled post" });
    }
  });

  // Links
  app.get("/api/links", async (req, res) => {
    try {
      const links = await storage.getLinks(MOCK_USER_ID);
      res.json(links);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch links" });
    }
  });

  app.post("/api/links", async (req, res) => {
    try {
      const linkData = insertLinkSchema.parse({ ...req.body, userId: MOCK_USER_ID });
      const link = await storage.createLink(linkData);
      res.json(link);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create link" });
    }
  });

  app.put("/api/links/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const link = await storage.updateLink(id, req.body);
      res.json(link);
    } catch (error) {
      res.status(500).json({ error: "Failed to update link" });
    }
  });

  app.delete("/api/links/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteLink(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete link" });
    }
  });

  // Analytics
  app.get("/api/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics(MOCK_USER_ID);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.post("/api/analytics", async (req, res) => {
    try {
      const analyticsData = insertAnalyticsSchema.parse({ ...req.body, userId: MOCK_USER_ID });
      const analytics = await storage.createAnalytics(analyticsData);
      res.json(analytics);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create analytics" });
    }
  });

  // Automation Settings
  app.get("/api/automation-settings", async (req, res) => {
    try {
      const settings = await storage.getAutomationSettings(MOCK_USER_ID);
      if (!settings) {
        // Create default settings if none exist
        const defaultSettings = await storage.createAutomationSettings({
          userId: MOCK_USER_ID,
          autoPost: true,
          smartScheduling: true,
          autoRetry: false,
          retryAttempts: 3,
          settings: {}
        });
        return res.json(defaultSettings);
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch automation settings" });
    }
  });

  app.put("/api/automation-settings", async (req, res) => {
    try {
      const settings = await storage.updateAutomationSettings(MOCK_USER_ID, req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update automation settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
