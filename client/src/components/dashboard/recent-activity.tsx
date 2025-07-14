import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Plus, Clock } from "lucide-react";

export default function RecentActivity() {
  // Mock recent activity data - in production this would come from API
  const activities = [
    {
      id: 1,
      title: "Post published successfully",
      description: "Campaign \"Summer Sale\" posted to Facebook",
      time: "2 hours ago",
      type: "success"
    },
    {
      id: 2,
      title: "New campaign created",
      description: "Tech Products campaign with 15 posts",
      time: "4 hours ago",
      type: "info"
    },
    {
      id: 3,
      title: "Posts scheduled",
      description: "20 posts scheduled for next week",
      time: "6 hours ago",
      type: "warning"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return { icon: Check, color: 'bg-brand-emerald' };
      case 'info':
        return { icon: Plus, color: 'bg-brand-blue' };
      case 'warning':
        return { icon: Clock, color: 'bg-brand-amber' };
      default:
        return { icon: Check, color: 'bg-brand-emerald' };
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-slate-800">Recent Activity</CardTitle>
        <Button variant="link" className="text-brand-blue hover:text-blue-700 text-sm font-medium">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const { icon: Icon, color } = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon className="text-white" size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                  <p className="text-xs text-slate-600">{activity.description}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
