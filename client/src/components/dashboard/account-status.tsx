import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { type AffiliateAccount, type SocialAccount } from "@shared/schema";
import { Handshake, Accessibility, ShoppingCart, TrendingUp } from "lucide-react";
import { SiFacebook, SiX, SiLinkedin, SiInstagram } from "react-icons/si";

const affiliateIcons = {
  earnkaro: Handshake,
  admitad: Accessibility,
  clickbank: ShoppingCart,
  impact: TrendingUp,
  jvzoo: ShoppingCart,
  warriorplus: ShoppingCart,
};

const socialIcons = {
  facebook: SiFacebook,
  twitter: SiX,
  linkedin: SiLinkedin,
  instagram: SiInstagram,
};

export default function AccountStatus() {
  const { data: affiliateAccounts = [] } = useQuery<AffiliateAccount[]>({
    queryKey: ['/api/affiliate-accounts'],
  });

  const { data: socialAccounts = [] } = useQuery<SocialAccount[]>({
    queryKey: ['/api/social-accounts'],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return 'bg-brand-emerald';
      case 'pending':
        return 'bg-brand-amber';
      case 'inactive':
      case 'disconnected':
      case 'expired':
        return 'bg-slate-400';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800">Affiliate Accounts</CardTitle>
          <Button variant="link" className="text-brand-blue hover:text-blue-700 text-sm font-medium">
            Manage All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {affiliateAccounts.length > 0 ? (
              affiliateAccounts.map((account) => {
                const Icon = affiliateIcons[account.platform as keyof typeof affiliateIcons] || Handshake;
                return (
                  <div key={account.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Icon className="text-orange-600" size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 capitalize">{account.platform}</p>
                        <p className="text-sm text-slate-600">${account.earnings || 0} earned</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(account.status)} text-white text-xs font-medium`}>
                      {account.status}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>No affiliate accounts connected</p>
                <Button variant="outline" className="mt-4">
                  Connect Account
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800">Social Media Accounts</CardTitle>
          <Button variant="link" className="text-brand-blue hover:text-blue-700 text-sm font-medium">
            Connect New
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {socialAccounts.length > 0 ? (
              socialAccounts.map((account) => {
                const Icon = socialIcons[account.platform as keyof typeof socialIcons] || SiFacebook;
                return (
                  <div key={account.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="text-blue-600" size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 capitalize">{account.platform}</p>
                        <p className="text-sm text-slate-600">
                          {account.followers || 0} {account.platform === 'linkedin' ? 'connections' : 'followers'}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(account.status)} text-white text-xs font-medium`}>
                      {account.status}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>No social media accounts connected</p>
                <Button variant="outline" className="mt-4">
                  Connect Account
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
