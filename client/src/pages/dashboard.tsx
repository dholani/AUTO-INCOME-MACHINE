import { useQuery } from "@tanstack/react-query";
import { useQuery as useUpcomingPostsQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { SiFacebook, SiX, SiInstagram } from "react-icons/si";
import { type ScheduledPost } from "@shared/schema";
import OverviewCards from "@/components/dashboard/overview-cards";
import QuickActions from "@/components/dashboard/quick-actions";
import AccountStatus from "@/components/dashboard/account-status";
import RecentActivity from "@/components/dashboard/recent-activity";
import AutomationControls from "@/components/dashboard/automation-controls";

const socialIcons = {
  facebook: SiFacebook,
  twitter: SiX,
  instagram: SiInstagram,
  linkedin: SiX, // Using X icon as fallback
};

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: upcomingPosts = [] } = useUpcomingPostsQuery<ScheduledPost[]>({
    queryKey: ['/api/scheduled-posts/upcoming'],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const formatScheduledTime = (scheduledAt: string) => {
    const date = new Date(scheduledAt);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const postDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const isToday = postDate.getTime() === today.getTime();
    const isTomorrow = postDate.getTime() === today.getTime() + 24 * 60 * 60 * 1000;
    
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    if (isToday) {
      return `Today at ${timeStr}`;
    } else if (isTomorrow) {
      return `Tomorrow at ${timeStr}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  if (statsLoading) {
    return (
      <div className="space-y-6">
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
      <OverviewCards stats={stats || { totalPosts: 0, activeCampaigns: 0, clickRate: 0, revenue: 0 }} />
      
      <QuickActions />
      
      <AccountStatus />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-800">Upcoming Posts</CardTitle>
            <Button variant="link" className="text-brand-blue hover:text-blue-700 text-sm font-medium">
              Manage Queue
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingPosts.length > 0 ? (
                upcomingPosts.map((post) => {
                  // For demo purposes, we'll use a mock social platform
                  const platform = 'facebook'; // In real app, this would come from the social account
                  const Icon = socialIcons[platform] || SiFacebook;
                  
                  return (
                    <div key={post.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="text-blue-600" size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 text-sm">
                            Scheduled Post #{post.id}
                          </p>
                          <p className="text-xs text-slate-600">
                            {formatScheduledTime(post.scheduledAt)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4 text-slate-400" />
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>No upcoming posts scheduled</p>
                  <Button variant="outline" className="mt-4">
                    Schedule Posts
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AutomationControls />
    </div>
  );
}
