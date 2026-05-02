import { useGetVoiceAgentConfig, getGetVoiceAgentConfigQueryKey, useUpdateVoiceAgentConfig } from "@workspace/api-client-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, Phone, Volume2 } from "lucide-react";

export default function VoiceAgent() {
  const { data: config, isLoading } = useGetVoiceAgentConfig();
  const updateConfig = useUpdateVoiceAgentConfig();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    assistantName: "",
    systemPrompt: "",
    supportedLanguages: "",
    escalationPhone: "",
    isActive: false,
    maxCallDurationSeconds: 600,
  });

  useEffect(() => {
    if (config) {
      setFormData({
        assistantName: config.assistantName || "",
        systemPrompt: config.systemPrompt || "",
        supportedLanguages: config.supportedLanguages || "",
        escalationPhone: config.escalationPhone || "",
        isActive: config.isActive,
        maxCallDurationSeconds: config.maxCallDurationSeconds || 600,
      });
    }
  }, [config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig.mutate({ data: formData }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetVoiceAgentConfigQueryKey() });
        toast({ title: "Configuration saved successfully." });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Voice Agent Configuration</h1>
        <p className="text-muted-foreground mt-1">Manage behavior and routing for the AI receptionist.</p>
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-primary" />
                Vapi AI Settings
              </CardTitle>
              <CardDescription className="mt-1">
                Updates sync immediately with the live voice agent.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 bg-background border px-4 py-2 rounded-lg shadow-sm">
              <Label htmlFor="active-toggle" className="font-medium cursor-pointer">
                {formData.isActive ? 'Agent Active' : 'Agent Paused'}
              </Label>
              <Switch 
                id="active-toggle" 
                checked={formData.isActive}
                onCheckedChange={(c) => setFormData({...formData, isActive: c})}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="assistantName">Assistant Name</Label>
                <Input 
                  id="assistantName" 
                  value={formData.assistantName} 
                  onChange={(e) => setFormData({...formData, assistantName: e.target.value})} 
                  placeholder="e.g. CareConnect Receptionist"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="escalationPhone">Escalation Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="escalationPhone" 
                    className="pl-9"
                    value={formData.escalationPhone} 
                    onChange={(e) => setFormData({...formData, escalationPhone: e.target.value})} 
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Calls are transferred here for critical issues.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea 
                id="systemPrompt" 
                rows={8}
                value={formData.systemPrompt} 
                onChange={(e) => setFormData({...formData, systemPrompt: e.target.value})} 
                className="font-mono text-sm"
                placeholder="You are a helpful home care assistant..."
              />
              <p className="text-xs text-muted-foreground">This defines the personality and rules the AI follows.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="supportedLanguages">Supported Languages</Label>
                <Input 
                  id="supportedLanguages" 
                  value={formData.supportedLanguages} 
                  onChange={(e) => setFormData({...formData, supportedLanguages: e.target.value})} 
                  placeholder="e.g. English, Spanish, Mandarin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDuration">Max Call Duration (seconds)</Label>
                <Input 
                  id="maxDuration" 
                  type="number"
                  value={formData.maxCallDurationSeconds} 
                  onChange={(e) => setFormData({...formData, maxCallDurationSeconds: parseInt(e.target.value) || 0})} 
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={updateConfig.isPending}>
                <Save className="mr-2 h-4 w-4" /> Save Configuration
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
