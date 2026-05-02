import { useGetClient, getGetClientQueryKey, useUpdateClient } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, User, Phone, MapPin, Calendar, Activity, Edit, Clock } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

export default function ClientDetail() {
  const params = useParams<{ id: string }>();
  const clientId = parseInt(params.id || "0", 10);
  const { data: client, isLoading } = useGetClient(clientId, { 
    query: { enabled: !!clientId, queryKey: getGetClientQueryKey(clientId) } 
  });
  
  const updateClient = useUpdateClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");

  const handleSaveNotes = () => {
    updateClient.mutate({ id: clientId, data: { notes } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetClientQueryKey(clientId) });
        setEditingNotes(false);
        toast({ title: "Notes updated" });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/clients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            {client.name}
            <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
              {client.status.replace('_', ' ')}
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1">Client Profile & Care Plan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground flex items-center gap-2"><Phone className="h-4 w-4"/> Phone</span>
              <span className="font-medium">{client.phone}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4"/> Address</span>
              <span className="font-medium">{client.address}</span>
            </div>
            {client.dateOfBirth && (
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4"/> Date of Birth</span>
                <span className="font-medium">{new Date(client.dateOfBirth).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex flex-col gap-1 pt-4 border-t">
              <span className="text-sm text-muted-foreground flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive"/> Emergency Contact</span>
              <span className="font-medium">{client.emergencyContact || 'Not provided'}</span>
              <span className="text-sm">{client.emergencyPhone}</span>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Care Notes
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setNotes(client.notes || "");
                  setEditingNotes(!editingNotes);
                }}
              >
                <Edit className="h-4 w-4 mr-2" /> {editingNotes ? "Cancel" : "Edit"}
              </Button>
            </CardHeader>
            <CardContent>
              {editingNotes ? (
                <div className="space-y-3">
                  <Textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    rows={4}
                  />
                  <Button onClick={handleSaveNotes} disabled={updateClient.isPending}>Save Notes</Button>
                </div>
              ) : (
                <div className="bg-muted/50 p-4 rounded-lg whitespace-pre-wrap text-sm">
                  {client.notes || <span className="text-muted-foreground italic">No notes added.</span>}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Care Plan details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg whitespace-pre-wrap text-sm">
                  {client.carePlan || <span className="text-muted-foreground italic">No care plan provided.</span>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Dummy import to fix AlertTriangle
import { AlertTriangle } from "lucide-react";
