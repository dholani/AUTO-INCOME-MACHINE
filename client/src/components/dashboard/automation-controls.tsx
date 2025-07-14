import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type AutomationSettings } from "@shared/schema";
import { Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AutomationControls() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<AutomationSettings>({
    queryKey: ['/api/automation-settings'],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: Partial<AutomationSettings>) => {
      const response = await apiRequest('PUT', '/api/automation-settings', updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/automation-settings'] });
      toast({
        title: "Settings updated",
        description: "Automation settings have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update automation settings.",
        variant: "destructive",
      });
    },
  });

  const handleToggle = (field: keyof AutomationSettings, value: boolean) => {
    updateSettingsMutation.mutate({ [field]: value });
  };

  const handleActivateFullAutomation = () => {
    updateSettingsMutation.mutate({
      autoPost: true,
      smartScheduling: true,
      autoRetry: true,
    });
    toast({
      title: "Full automation activated",
      description: "All automation features have been enabled.",
    });
  };

  if (isLoading) {
    return (
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              <div className="h-16 bg-slate-200 rounded"></div>
              <div className="h-16 bg-slate-200 rounded"></div>
              <div className="h-16 bg-slate-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">Automation Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <Label className="font-medium text-slate-800">Auto-Post</Label>
              <p className="text-sm text-slate-600">Schedule posts automatically</p>
            </div>
            <Switch
              checked={settings?.autoPost || false}
              onCheckedChange={(value) => handleToggle('autoPost', value)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <Label className="font-medium text-slate-800">Smart Scheduling</Label>
              <p className="text-sm text-slate-600">Optimize posting times</p>
            </div>
            <Switch
              checked={settings?.smartScheduling || false}
              onCheckedChange={(value) => handleToggle('smartScheduling', value)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <Label className="font-medium text-slate-800">Auto-Retry</Label>
              <p className="text-sm text-slate-600">Retry failed posts</p>
            </div>
            <Switch
              checked={settings?.autoRetry || false}
              onCheckedChange={(value) => handleToggle('autoRetry', value)}
            />
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-center">
          <Button 
            className="bg-brand-blue hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
            onClick={handleActivateFullAutomation}
            disabled={updateSettingsMutation.isPending}
          >
            <Play className="mr-2" size={16} />
            Activate Full Automation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
