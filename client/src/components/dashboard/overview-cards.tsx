import { Card, CardContent } from "@/components/ui/card";
import { Share, Megaphone, MousePointer, DollarSign } from "lucide-react";

interface OverviewCardsProps {
  stats: {
    totalPosts: number;
    activeCampaigns: number;
    clickRate: number;
    revenue: number;
  };
}

export default function OverviewCards({ stats }: OverviewCardsProps) {
  const cards = [
    {
      title: "Total Posts",
      value: stats.totalPosts.toLocaleString(),
      change: "+12%",
      changeLabel: "from last month",
      icon: Share,
      bgColor: "bg-blue-100",
      iconColor: "text-brand-blue"
    },
    {
      title: "Active Campaigns",
      value: stats.activeCampaigns.toString(),
      change: "+3",
      changeLabel: "new this week",
      icon: Megaphone,
      bgColor: "bg-emerald-100",
      iconColor: "text-brand-emerald"
    },
    {
      title: "Click Rate",
      value: `${stats.clickRate}%`,
      change: "+0.3%",
      changeLabel: "from last week",
      icon: MousePointer,
      bgColor: "bg-amber-100",
      iconColor: "text-brand-amber"
    },
    {
      title: "Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      change: "+18%",
      changeLabel: "from last month",
      icon: DollarSign,
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{card.title}</p>
                  <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`${card.iconColor}`} size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-brand-emerald font-medium">{card.change}</span>
                <span className="text-slate-600 ml-1">{card.changeLabel}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
