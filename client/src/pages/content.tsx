import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Copy, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type ContentTemplate } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { SiFacebook, SiX, SiLinkedin, SiInstagram } from "react-icons/si";

const platformIcons = {
  facebook: SiFacebook,
  twitter: SiX,
  linkedin: SiLinkedin,
  instagram: SiInstagram,
};

const platformColors = {
  facebook: 'bg-blue-100 text-blue-800',
  twitter: 'bg-sky-100 text-sky-800',
  linkedin: 'bg-blue-100 text-blue-800',
  instagram: 'bg-pink-100 text-pink-800',
};

export default function Content() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: contentTemplates = [], isLoading } = useQuery<ContentTemplate[]>({
    queryKey: ['/api/content-templates'],
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/content-templates/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-templates'] });
      toast({
        title: "Template deleted",
        description: "Content template has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete content template.",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to clipboard.",
    });
  };

  const filteredTemplates = contentTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = !selectedPlatform || template.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  const platforms = ['facebook', 'twitter', 'linkedin', 'instagram'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Content Library</h1>
          <p className="text-slate-600">Manage your content templates and posts</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button className="bg-brand-blue hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search content templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={selectedPlatform === "" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedPlatform("")}
          >
            All
          </Button>
          {platforms.map(platform => (
            <Button
              key={platform}
              variant={selectedPlatform === platform ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPlatform(platform)}
              className="capitalize"
            >
              {platform}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="border-slate-200">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="h-20 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => {
            const Icon = platformIcons[template.platform as keyof typeof platformIcons] || SiFacebook;
            const platformColor = platformColors[template.platform as keyof typeof platformColors] || 'bg-gray-100 text-gray-800';
            
            return (
              <Card key={template.id} className="border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <Badge className={platformColor}>
                      {template.platform}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(template.content)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteTemplateMutation.mutate(template.id)}
                      disabled={deleteTemplateMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium text-slate-800">{template.title}</h3>
                    </div>
                    
                    <div>
                      <p className="text-sm text-slate-600 line-clamp-4">
                        {template.content}
                      </p>
                    </div>
                    
                    {template.hashtags && template.hashtags.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Hashtags</p>
                        <div className="flex flex-wrap gap-1">
                          {template.hashtags.slice(0, 3).map((hashtag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{hashtag}
                            </Badge>
                          ))}
                          {template.hashtags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{template.hashtags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {template.mediaUrls && template.mediaUrls.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-slate-700">Media</p>
                        <p className="text-sm text-slate-600">{template.mediaUrls.length} file(s)</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2 border-t">
                      <p className="text-xs text-slate-500">
                        Created {new Date(template.createdAt).toLocaleDateString()}
                      </p>
                      <Button variant="outline" size="sm">
                        Use Template
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
                  {searchTerm || selectedPlatform ? 'No templates found' : 'No content templates yet'}
                </h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm || selectedPlatform
                    ? 'Try adjusting your search or filter criteria'
                    : 'Create your first content template to get started'
                  }
                </p>
                <Button className="bg-brand-blue hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
