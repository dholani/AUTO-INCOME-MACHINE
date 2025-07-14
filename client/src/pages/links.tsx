import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Copy, ExternalLink, BarChart3, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Link, type Campaign } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Links() {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: links = [], isLoading } = useQuery<Link[]>({
    queryKey: ['/api/links'],
  });

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });

  const deleteLinkMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/links/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/links'] });
      toast({
        title: "Link deleted",
        description: "Link has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete link.",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${type} has been copied to clipboard.`,
    });
  };

  const filteredLinks = links.filter(link =>
    link.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.shortUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const totalLinks = links.length;
  const averageClicks = totalLinks > 0 ? totalClicks / totalLinks : 0;

  const getCampaignTitle = (campaignId: number | null) => {
    if (!campaignId) return 'No campaign';
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign?.title || 'Unknown campaign';
  };

  const getPerformanceColor = (clicks: number) => {
    if (clicks >= 100) return 'bg-green-100 text-green-800';
    if (clicks >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Link Manager</h1>
          <p className="text-slate-600">Manage and track your affiliate links</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button className="bg-brand-blue hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Link
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Links</p>
                <p className="text-2xl font-bold text-slate-800">{totalLinks}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ExternalLink className="text-brand-blue" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Clicks</p>
                <p className="text-2xl font-bold text-slate-800">{totalClicks.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="text-brand-emerald" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg. Clicks</p>
                <p className="text-2xl font-bold text-slate-800">{averageClicks.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="text-brand-amber" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">All</Button>
          <Button variant="outline" size="sm">High Performance</Button>
          <Button variant="outline" size="sm">Low Performance</Button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <Card key={i} className="border-slate-200">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredLinks.length > 0 ? (
          filteredLinks.map((link) => (
            <Card key={link.id} className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getPerformanceColor(link.clicks || 0)}>
                        {link.clicks || 0} clicks
                      </Badge>
                      <Badge variant="outline">
                        {getCampaignTitle(link.campaignId)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-slate-700">Short URL</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-brand-blue font-mono">{link.shortUrl}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(link.shortUrl, 'Short URL')}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-slate-700">Original URL</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-slate-600 truncate max-w-md">{link.originalUrl}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(link.originalUrl, 'Original URL')}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(link.originalUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteLinkMutation.mutate(link.id)}
                      disabled={deleteLinkMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <p className="text-xs text-slate-500">
                    Created {new Date(link.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-800">{link.clicks || 0}</p>
                      <p className="text-xs text-slate-500">Clicks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-brand-emerald">
                        {link.clicks && link.clicks > 0 ? ((link.clicks / totalClicks) * 100).toFixed(1) : 0}%
                      </p>
                      <p className="text-xs text-slate-500">Share</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-slate-200">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-slate-800 mb-2">
                  {searchTerm ? 'No links found' : 'No links yet'}
                </h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Create your first shortened link to start tracking clicks'
                  }
                </p>
                <Button className="bg-brand-blue hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Link
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
