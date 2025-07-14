import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Search, Edit, Trash2, Calendar as CalendarIcon, Clock, Play, Pause } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type ScheduledPost, type Campaign, type ContentTemplate, type SocialAccount } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { SiFacebook, SiX, SiLinkedin, SiInstagram } from "react-icons/si";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const socialIcons = {
  facebook: SiFacebook,
  twitter: SiX,
  linkedin: SiLinkedin,
  instagram: SiInstagram,
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  posted: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export default function Scheduler() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: scheduledPosts = [], isLoading } = useQuery<ScheduledPost[]>({
    queryKey: ['/api/scheduled-posts'],
  });

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });

  const { data: socialAccounts = [] } = useQuery<SocialAccount[]>({
    queryKey: ['/api/social-accounts'],
  });

  const { data: contentTemplates = [] } = useQuery<ContentTemplate[]>({
    queryKey: ['/api/content-templates'],
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/scheduled-posts/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scheduled-posts'] });
      toast({
        title: "Post deleted",
        description: "Scheduled post has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete scheduled post.",
        variant: "destructive",
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<ScheduledPost> }) => {
      const response = await apiRequest('PUT', `/api/scheduled-posts/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scheduled-posts'] });
      toast({
        title: "Post updated",
        description: "Scheduled post has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update scheduled post.",
        variant: "destructive",
      });
    },
  });

  const filteredPosts = scheduledPosts.filter(post => {
    const matchesSearch = post.postId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || post.status === selectedStatus;
    const matchesDate = !selectedDate || 
                       new Date(post.scheduledAt).toDateString() === selectedDate.toDateString();
    // For platform filtering, we'd need to join with social accounts
    return matchesSearch && matchesStatus && matchesDate;
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
      return format(date, 'MMM d, yyyy \'at\' h:mm a');
    }
  };

  const getSocialAccountPlatform = (socialAccountId: number) => {
    const account = socialAccounts.find(acc => acc.id === socialAccountId);
    return account?.platform || 'facebook';
  };

  const togglePostStatus = (post: ScheduledPost) => {
    const newStatus = post.status === 'pending' ? 'cancelled' : 'pending';
    updatePostMutation.mutate({
      id: post.id,
      updates: { status: newStatus }
    });
  };

  const statuses = ['pending', 'posted', 'failed', 'cancelled'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Scheduler</h1>
          <p className="text-slate-600">Manage your scheduled posts and content calendar</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar View
          </Button>
          <Button className="bg-brand-blue hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Post
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4 flex-wrap gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search scheduled posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            {statuses.map(status => (
              <SelectItem key={status} value={status} className="capitalize">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-40 justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {(selectedStatus || selectedDate) && (
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedStatus("");
              setSelectedDate(undefined);
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="border-slate-200">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const platform = getSocialAccountPlatform(post.socialAccountId);
            const Icon = socialIcons[platform as keyof typeof socialIcons] || SiFacebook;
            const statusColor = statusColors[post.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
            
            return (
              <Card key={post.id} className="border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-slate-600" />
                    <Badge className={statusColor}>
                      {post.status}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => togglePostStatus(post)}
                      disabled={updatePostMutation.isPending || post.status === 'posted'}
                    >
                      {post.status === 'pending' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deletePostMutation.mutate(post.id)}
                      disabled={deletePostMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <p className="text-sm font-medium text-slate-800">
                        {formatScheduledTime(post.scheduledAt)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-slate-700">Platform</p>
                      <p className="text-sm text-slate-600 capitalize">{platform}</p>
                    </div>
                    
                    {post.campaignId && (
                      <div>
                        <p className="text-sm font-medium text-slate-700">Campaign</p>
                        <p className="text-sm text-slate-600">
                          {campaigns.find(c => c.id === post.campaignId)?.title || 'Unknown Campaign'}
                        </p>
                      </div>
                    )}
                    
                    {post.postId && (
                      <div>
                        <p className="text-sm font-medium text-slate-700">Post ID</p>
                        <p className="text-sm text-slate-600 font-mono">{post.postId}</p>
                      </div>
                    )}
                    
                    {post.errorMessage && (
                      <div>
                        <p className="text-sm font-medium text-red-700">Error</p>
                        <p className="text-sm text-red-600">{post.errorMessage}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2 border-t">
                      <p className="text-xs text-slate-500">
                        Created {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
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
                <h3 className="text-lg font-medium text-slate-800 mb-2">
                  {searchTerm || selectedStatus || selectedDate ? 'No scheduled posts found' : 'No scheduled posts yet'}
                </h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm || selectedStatus || selectedDate
                    ? 'Try adjusting your search or filter criteria'
                    : 'Schedule your first post to get started with automated publishing'
                  }
                </p>
                <Button className="bg-brand-blue hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
