import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock, Upload } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Create Campaign",
      description: "Launch new affiliate campaign",
      icon: Plus,
      bgColor: "bg-brand-blue",
      action: "createCampaign"
    },
    {
      title: "Schedule Posts",
      description: "Auto-schedule content",
      icon: Clock,
      bgColor: "bg-brand-emerald",
      action: "schedulePost"
    },
    {
      title: "Bulk Upload",
      description: "Upload content templates",
      icon: Upload,
      bgColor: "bg-brand-amber",
      action: "bulkUpload"
    }
  ];

  const handleAction = (action: string) => {
    console.log(`Action triggered: ${action}`);
    // TODO: Implement specific action handlers
  };

  return (
    <Card className="border-slate-200 mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="flex items-center justify-start space-x-3 p-4 h-auto border-slate-200 hover:bg-slate-50 transition-colors"
                onClick={() => handleAction(action.action)}
              >
                <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white" size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-800">{action.title}</p>
                  <p className="text-sm text-slate-600">{action.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
