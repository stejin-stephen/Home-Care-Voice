import { useGetCallLogs, getGetCallLogsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone, Clock, FileText, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function CallLogs() {
  const { data: logs, isLoading } = useGetCallLogs();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Call Logs</h1>
        <p className="text-muted-foreground mt-1">Transcripts and outcomes from the AI voice assistant.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : logs && logs.length > 0 ? (
        <div className="space-y-4">
          {logs.map((log) => (
            <Accordion type="single" collapsible key={log.id} className="bg-card border rounded-xl shadow-sm overflow-hidden">
              <AccordionItem value={`item-${log.id}`} className="border-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center w-full gap-4 pr-4">
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{log.callerName || log.callerPhone || 'Unknown Caller'}</div>
                        <div className="text-xs text-muted-foreground">{format(new Date(log.createdAt), "MMM d, yyyy h:mm a")}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-1">
                      {log.intent && (
                        <Badge variant="outline" className="capitalize bg-background">
                          {log.intent.replace('_', ' ')}
                        </Badge>
                      )}
                      <Badge variant={log.outcome === 'resolved' ? 'default' : log.outcome === 'escalated' ? 'destructive' : 'secondary'} className="capitalize">
                        {log.outcome.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0 md:ml-auto">
                      <Clock className="h-4 w-4" />
                      {log.durationSeconds ? `${Math.floor(log.durationSeconds / 60)}m ${log.durationSeconds % 60}s` : 'Unknown duration'}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 border-t">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-6 text-sm">
                      <div>
                        <span className="text-muted-foreground block mb-1">Phone Number</span>
                        <span className="font-medium">{log.callerPhone || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Language</span>
                        <span className="font-medium capitalize">{log.language}</span>
                      </div>
                      {log.clientName && (
                        <div>
                          <span className="text-muted-foreground block mb-1">Matched Client</span>
                          <span className="font-medium flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {log.clientName}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4" />
                        Transcript
                      </h4>
                      <div className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap leading-relaxed">
                        {log.transcript || "No transcript available for this call."}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-xl bg-card">
          <Phone className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-1">No call logs</h3>
          <p className="text-muted-foreground">
            No calls have been processed by the assistant yet.
          </p>
        </div>
      )}
    </div>
  );
}
