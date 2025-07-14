import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { type Analytics, type Campaign, type SocialAccount } from "@shared/schema";
import { BarChart3, TrendingUp, Eye, MousePointer, Users, Calendar, Download } from "lucide-react";
import { SiFacebook, SiX, SiLinkedin, SiInstagram } from "react-icons/si";

const socialIcons = {
  facebook: SiFacebook,
  twitter: SiX,
  linkedin: SiLinkedin,
  instagram: SiInstagram,
};

const metricIcons = {
  clicks: MousePointer,
  impressions: Eye,
  engagement: Users,
  conversions: TrendingUp,
};

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");

  const { data: analytics = [], isLoading } = useQuery<Analytics[]>({
    queryKey: ['/api/analytics'],
  });

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });

  const { data: socialAccounts = [] } = useQuery<SocialAccount[]>({
    queryKey: ['/api/social-accounts'],
  });

  const { data: dashboardStats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  // Group analytics by metric
  const analyticsGrouped = analytics.reduce((acc, item) => {
    if (!acc[item.metric]) {
      acc[item.metric] = [];
    }
    acc[item.metric].push(item);
    return acc;
  }, {} as Record<string, Analytics[]>);

  // Calculate totals for each metric
  const metricTotals = Object.keys(analyticsGrouped).map(metric => {
    const total = analyticsGrouped[metric].reduce((sum, item) => sum + item.value, 0);
    return { metric, total, data: analyticsGrouped[metric] };
  });

  // Get platform performance
  const platformPerformance = socialAccounts.map(account => {
    const platformAnalytics = analytics.filter(a => a.socialAccountId === account.id);
    const totalClicks = platformAnalytics
      .filter(a => a.metric === 'clicks')
      .reduce((sum, item) => sum + item.value, 0);
    const totalImpressions = platformAnalytics
      .filter(a => a.metric === 'impressions')
      .reduce((sum, item) => sum + item.value, 0);
    
    return {
      platform: account.platform,
      followers: account.followers || 0,
      clicks: totalClicks,
      impressions: totalImpressions,
      ctr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
    };
  });

  // Get campaign performance
  const campaignPerformance = campaigns.map(campaign => {
    const campaignAnalytics = analytics.filter(a => a.campaignId === campaign.id);
    const totalClicks = campaignAnalytics
      .filter(a => a.metric === 'clicks')
      .reduce((sum, item) => sum + item.value, 0);
    const totalConversions = campaignAnalytics
      .filter(a => a.metric === 'conversions')
      .reduce((sum, item) => sum + item.value, 0);
    
    return {
      id: campaign.id,
      title: campaign.title,
      status: campaign.status,
      clicks: totalClicks,
      conversions: totalConversions,
      revenue: campaign.commission || 0,
      conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
            <p className="text-slate-600">Track your campaign performance and insights</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-slate-200">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
          <p className="text-slate-600">Track your campaign performance and insights</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All campaigns" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All campaigns</SelectItem>
            {campaigns.map(campaign => (
              <SelectItem key={campaign.id} value={campaign.id.toString()}>
                {campaign.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All platforms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All platforms</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Posts</p>
                <p className="text-2xl font-bold text-slate-800">{dashboardStats?.totalPosts || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="text-brand-blue" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Click Rate</p>
                <p className="text-2xl font-bold text-slate-800">{dashboardStats?.clickRate || 0}%</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <MousePointer className="text-brand-emerald" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Clicks</p>
                <p className="text-2xl font-bold text-slate-800">
                  {metricTotals.find(m => m.metric === 'clicks')?.total || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Eye className="text-brand-amber" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Revenue</p>
                <p className="text-2xl font-bold text-slate-800">${dashboardStats?.revenue || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-green-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="platforms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="platforms">Platform Performance</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
          <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformPerformance.length > 0 ? (
              platformPerformance.map((platform, index) => {
                const Icon = socialIcons[platform.platform as keyof typeof socialIcons] || SiFacebook;
                return (
                  <Card key={index} className="border-slate-200">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                      <Icon className="w-5 h-5 mr-2 text-slate-600" />
                      <CardTitle className="text-lg font-medium capitalize">{platform.platform}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-slate-700">Followers</p>
                            <p className="text-xl font-bold text-slate-800">{platform.followers.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">Clicks</p>
                            <p className="text-xl font-bold text-brand-blue">{platform.clicks.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-slate-700">Impressions</p>
                            <p className="text-xl font-bold text-slate-800">{platform.impressions.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">CTR</p>
                            <p className="text-xl font-bold text-brand-emerald">{platform.ctr.toFixed(2)}%</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="border-slate-200 col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-slate-800 mb-2">No platform data available</h3>
                    <p className="text-slate-600 mb-4">Connect your social media accounts to see performance metrics</p>
                    <Button className="bg-brand-blue hover:bg-blue-700">
                      Connect Accounts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <div className="space-y-4">
            {campaignPerformance.length > 0 ? (
              campaignPerformance.map((campaign) => (
                <Card key={campaign.id} className="border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-slate-800">{campaign.title}</h3>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700">Clicks</p>
                        <p className="text-xl font-bold text-brand-blue">{campaign.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Conversions</p>
                        <p className="text-xl font-bold text-brand-emerald">{campaign.conversions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Revenue</p>
                        <p className="text-xl font-bold text-green-600">${campaign.revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Conv. Rate</p>
                        <p className="text-xl font-bold text-brand-amber">{campaign.conversionRate.toFixed(2)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-slate-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-slate-800 mb-2">No campaign data available</h3>
                    <p className="text-slate-600 mb-4">Create campaigns to see performance metrics</p>
                    <Button className="bg-brand-blue hover:bg-blue-700">
                      Create Campaign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricTotals.length > 0 ? (
              metricTotals.map((metric) => {
                const Icon = metricIcons[metric.metric as keyof typeof metricIcons] || BarChart3;
                return (
                  <Card key={metric.metric} className="border-slate-200">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                      <Icon className="w-5 h-5 mr-2 text-slate-600" />
                      <CardTitle className="text-lg font-medium capitalize">{metric.metric}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-2xl font-bold text-slate-800">{metric.total.toLocaleString()}</p>
                        <p className="text-sm text-slate-600">{metric.data.length} data points</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="border-slate-200 col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-slate-800 mb-2">No metrics data available</h3>
                    <p className="text-slate-600 mb-4">Start posting content to see detailed metrics</p>
                    <Button className="bg-brand-blue hover:bg-blue-700">
                      Schedule Posts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
