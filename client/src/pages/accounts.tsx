import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type AffiliateAccount, type SocialAccount } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { SiFacebook, SiX, SiLinkedin, SiInstagram } from "react-icons/si";

const affiliatePlatforms = [
  { id: 'earnkaro', name: 'EarnKaro', color: 'bg-orange-100 text-orange-800' },
  { id: 'admitad', name: 'Admitad', color: 'bg-blue-100 text-blue-800' },
  { id: 'impact', name: 'Impact', color: 'bg-green-100 text-green-800' },
  { id: 'jvzoo', name: 'JVZoo', color: 'bg-purple-100 text-purple-800' },
  { id: 'warriorplus', name: 'WarriorPlus', color: 'bg-red-100 text-red-800' },
  { id: 'clickbank', name: 'ClickBank', color: 'bg-yellow-100 text-yellow-800' },
];

const socialPlatforms = [
  { id: 'facebook', name: 'Facebook', icon: SiFacebook, color: 'text-blue-600' },
  { id: 'twitter', name: 'Twitter', icon: SiX, color: 'text-sky-600' },
  { id: 'linkedin', name: 'LinkedIn', icon: SiLinkedin, color: 'text-blue-700' },
  { id: 'instagram', name: 'Instagram', icon: SiInstagram, color: 'text-pink-600' },
];

export default function Accounts() {
  const [activeTab, setActiveTab] = useState<'affiliate' | 'social'>('affiliate');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: affiliateAccounts = [], isLoading: affiliateLoading } = useQuery<AffiliateAccount[]>({
    queryKey: ['/api/affiliate-accounts'],
  });

  const { data: socialAccounts = [], isLoading: socialLoading } = useQuery<SocialAccount[]>({
    queryKey: ['/api/social-accounts'],
  });

  const deleteAffiliateMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/affiliate-accounts/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/affiliate-accounts'] });
      toast({
        title: "Account deleted",
        description: "Affiliate account has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete affiliate account.",
        variant: "destructive",
      });
    },
  });

  const deleteSocialMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/social-accounts/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social-accounts'] });
      toast({
        title: "Account disconnected",
        description: "Social media account has been disconnected successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to disconnect social media account.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
      case 'disconnected':
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformInfo = (platform: string) => {
    return affiliatePlatforms.find(p => p.id === platform) || 
           { id: platform, name: platform, color: 'bg-gray-100 text-gray-800' };
  };

  const getSocialPlatformInfo = (platform: string) => {
    return socialPlatforms.find(p => p.id === platform) || 
           { id: platform, name: platform, icon: SiFacebook, color: 'text-gray-600' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Account Management</h1>
          <p className="text-slate-600">Manage your affiliate and social media accounts</p>
        </div>
        <Button className="bg-brand-blue hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </div>

      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'affiliate' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('affiliate')}
          className={activeTab === 'affiliate' ? 'bg-white shadow-sm' : ''}
        >
          Affiliate Accounts
        </Button>
        <Button
          variant={activeTab === 'social' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('social')}
          className={activeTab === 'social' ? 'bg-white shadow-sm' : ''}
        >
          Social Media
        </Button>
      </div>

      {activeTab === 'affiliate' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {affiliateLoading ? (
            [...Array(6)].map((_, i) => (
              <Card key={i} className="border-slate-200">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                    <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : affiliateAccounts.length > 0 ? (
            affiliateAccounts.map((account) => {
              const platformInfo = getPlatformInfo(account.platform);
              return (
                <Card key={account.id} className="border-slate-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <Badge className={platformInfo.color}>
                        {platformInfo.name}
                      </Badge>
                      <Badge className={`ml-2 ${getStatusColor(account.status)}`}>
                        {account.status}
                      </Badge>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteAffiliateMutation.mutate(account.id)}
                        disabled={deleteAffiliateMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-slate-700">Account ID</p>
                        <p className="text-sm text-slate-600">{account.accountId}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Earnings</p>
                        <p className="text-lg font-bold text-green-600">${account.earnings || 0}</p>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <p className="text-xs text-slate-500">
                          Added {new Date(account.createdAt).toLocaleDateString()}
                        </p>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View
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
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No affiliate accounts</h3>
                  <p className="text-slate-600 mb-4">Get started by connecting your first affiliate account</p>
                  <Button className="bg-brand-blue hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Affiliate Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'social' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialLoading ? (
            [...Array(6)].map((_, i) => (
              <Card key={i} className="border-slate-200">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                    <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : socialAccounts.length > 0 ? (
            socialAccounts.map((account) => {
              const platformInfo = getSocialPlatformInfo(account.platform);
              const Icon = platformInfo.icon;
              return (
                <Card key={account.id} className="border-slate-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-5 h-5 ${platformInfo.color}`} />
                      <span className="font-medium text-slate-800">{platformInfo.name}</span>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteSocialMutation.mutate(account.id)}
                        disabled={deleteSocialMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge className={getStatusColor(account.status)}>
                        {account.status}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Account ID</p>
                        <p className="text-sm text-slate-600">{account.accountId}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Followers</p>
                        <p className="text-lg font-bold text-brand-blue">
                          {(account.followers || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <p className="text-xs text-slate-500">
                          Connected {new Date(account.createdAt).toLocaleDateString()}
                        </p>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View
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
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No social media accounts</h3>
                  <p className="text-slate-600 mb-4">Connect your social media accounts to start posting</p>
                  <Button className="bg-brand-blue hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Connect Social Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
