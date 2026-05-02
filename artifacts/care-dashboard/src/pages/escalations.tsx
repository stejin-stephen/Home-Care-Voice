import { useGetEscalationsFiltered, getGetEscalationsQueryKey, useUpdateEscalation } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CheckCircle2, Clock, User, PhoneCall, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useState, useMemo } from "react";

export default function Escalations() {
  const updateEscalation = useUpdateEscalation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [filterPriority, setFilterPriority] = useState("");
  const [filterResolved, setFilterResolved] = useState("");

  const filters = useMemo(() => ({
    priority: filterPriority || undefined,
    resolved: filterResolved ? (filterResolved as "true" | "false") : undefined,
  }), [filterPriority, filterResolved]);

  const { data: escalations, isLoading } = useGetEscalationsFiltered(filters);

  const handleResolve = (id: number) => {
    updateEscalation.mutate({ id, data: { resolved: true, resolvedAt: new Date().toISOString() } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetEscalationsQueryKey() });
        toast({ title: "Escalation resolved" });
      }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500 text-white border-transparent";
      case "high": return "bg-orange-500 text-white border-transparent";
      case "medium": return "bg-yellow-500 text-white border-transparent";
      default: return "bg-blue-500 text-white border-transparent";
    }
  };

  const sortedEscalations = useMemo(() => {
    if (!escalations) return [];
    return [...escalations].sort((a, b) => Number(a.resolved) - Number(b.resolved));
  }, [escalations]);

  const hasFilters = !!(filterPriority || filterResolved);

  const clearFilters = () => {
    setFilterPriority("");
    setFilterResolved("");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Escalations</h1>
        <p className="text-muted-foreground mt-1">Issues requiring human intervention.</p>
      </div>

      <div className="flex flex-wrap gap-3 items-end p-4 bg-muted/40 rounded-xl border">
        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-xs text-muted-foreground font-medium">Priority</label>
          <Select value={filterPriority || "all"} onValueChange={v => setFilterPriority(v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 bg-background">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-xs text-muted-foreground font-medium">Status</label>
          <Select value={filterResolved || "all"} onValueChange={v => setFilterResolved(v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 bg-background">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Open &amp; Resolved</SelectItem>
              <SelectItem value="false">Open only</SelectItem>
              <SelectItem value="true">Resolved only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 gap-1 text-muted-foreground">
            <X className="h-4 w-4" /> Clear
          </Button>
        )}

        <span className="ml-auto text-xs text-muted-foreground self-end pb-1">
          {escalations ? `${escalations.length} result${escalations.length !== 1 ? "s" : ""}` : ""}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : sortedEscalations.length > 0 ? (
        <div className="space-y-4">
          {sortedEscalations.map((esc) => (
            <Card key={esc.id} className={esc.resolved ? "opacity-60 bg-muted/30" : "border-l-4"} style={!esc.resolved ? { borderLeftColor: esc.priority === 'critical' ? 'hsl(var(--destructive))' : 'hsl(var(--primary))' } : {}}>
              <CardContent className="p-5 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className={getPriorityColor(esc.priority)}>
                      {esc.priority.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(esc.createdAt), "MMM d, h:mm a")}
                    </span>
                    {esc.resolved && (
                      <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Resolved
                      </Badge>
                    )}
                  </div>

                  <p className="font-medium text-lg">{esc.reason}</p>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {esc.clientName || 'Unknown Client'}
                    </div>
                    {esc.assignedTo && (
                      <div className="flex items-center gap-1">
                        Assigned: <span className="font-medium text-foreground">{esc.assignedTo}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
                  {esc.callLogId && (
                    <Link href="/call-logs">
                      <Button variant="outline" size="sm" className="w-full">
                        <PhoneCall className="h-4 w-4 mr-2" /> View Call
                      </Button>
                    </Link>
                  )}
                  {!esc.resolved && (
                    <Button size="sm" className="w-full" onClick={() => handleResolve(esc.id)}>
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-xl bg-card">
          <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-1">
            {hasFilters ? "No matching escalations" : "All clear"}
          </h3>
          <p className="text-muted-foreground">
            {hasFilters ? "Try adjusting your filters." : "There are no open escalations. Great job!"}
          </p>
        </div>
      )}
    </div>
  );
}
