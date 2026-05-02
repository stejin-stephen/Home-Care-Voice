import { useGetRemindersFiltered, getGetRemindersQueryKey, useUpdateReminder, useCreateReminder, useGetClients } from "@workspace/api-client-react";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Plus, Calendar as CalendarIcon, CheckCircle2, XCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const createSchema = z.object({
  clientId: z.coerce.number().min(1, "Client is required"),
  type: z.enum(["medication", "visit", "appointment", "follow_up", "wellness_check"]).default("medication"),
  message: z.string().min(1, "Message is required"),
  scheduledAt: z.string().min(1, "Date/Time is required"),
});

export default function Reminders() {
  const { data: clients } = useGetClients();
  const updateReminder = useUpdateReminder();
  const createReminder = useCreateReminder();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filters = useMemo(() => ({
    type: filterType || undefined,
    status: filterStatus || undefined,
  }), [filterType, filterStatus]);

  const { data: reminders, isLoading } = useGetRemindersFiltered(filters);

  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      clientId: 0,
      type: "medication",
      message: "",
      scheduledAt: new Date().toISOString().slice(0, 16),
    },
  });

  const onSubmit = (data: z.infer<typeof createSchema>) => {
    createReminder.mutate({ data: { ...data, status: "pending", scheduledAt: new Date(data.scheduledAt).toISOString() } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetRemindersQueryKey() });
        setOpen(false);
        form.reset();
        toast({ title: "Reminder scheduled" });
      }
    });
  };

  const handleStatusChange = (id: number, status: any) => {
    updateReminder.mutate({ id, data: { status } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetRemindersQueryKey() });
      }
    });
  };

  const hasFilters = !!(filterType || filterStatus);

  const clearFilters = () => {
    setFilterType("");
    setFilterStatus("");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reminders</h1>
          <p className="text-muted-foreground mt-1">Automated messages and alerts for clients.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Schedule Reminder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Reminder</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value ? String(field.value) : undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients?.map(c => (
                            <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="medication">Medication</SelectItem>
                          <SelectItem value="visit">Visit</SelectItem>
                          <SelectItem value="appointment">Appointment</SelectItem>
                          <SelectItem value="wellness_check">Wellness Check</SelectItem>
                          <SelectItem value="follow_up">Follow Up</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scheduledAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scheduled Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Input placeholder="Time to take your medication..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createReminder.isPending}>
                  Schedule
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-3 items-end p-4 bg-muted/40 rounded-xl border">
        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-xs text-muted-foreground font-medium">Type</label>
          <Select value={filterType || "all"} onValueChange={v => setFilterType(v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 bg-background">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="medication">Medication</SelectItem>
              <SelectItem value="visit">Visit</SelectItem>
              <SelectItem value="appointment">Appointment</SelectItem>
              <SelectItem value="wellness_check">Wellness Check</SelectItem>
              <SelectItem value="follow_up">Follow Up</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-xs text-muted-foreground font-medium">Status</label>
          <Select value={filterStatus || "all"} onValueChange={v => setFilterStatus(v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 bg-background">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 gap-1 text-muted-foreground">
            <X className="h-4 w-4" /> Clear
          </Button>
        )}

        <span className="ml-auto text-xs text-muted-foreground self-end pb-1">
          {reminders ? `${reminders.length} result${reminders.length !== 1 ? "s" : ""}` : ""}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : reminders && reminders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reminders.map((rem) => (
            <Card key={rem.id} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${rem.status === 'pending' ? 'bg-primary' : rem.status === 'sent' || rem.status === 'acknowledged' ? 'bg-green-500' : 'bg-muted'}`} />
              <CardContent className="p-5 pl-6">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="capitalize text-xs">
                    {rem.type.replace('_', ' ')}
                  </Badge>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    {format(new Date(rem.scheduledAt), "MMM d, h:mm a")}
                  </div>
                </div>

                <p className="font-medium text-sm mb-1">{rem.message}</p>
                <p className="text-xs text-muted-foreground mb-4">To: {rem.clientName || 'Unknown Client'}</p>

                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <span className={`text-xs font-medium flex items-center gap-1 capitalize
                    ${rem.status === 'pending' ? 'text-primary' :
                      rem.status === 'failed' || rem.status === 'cancelled' ? 'text-destructive' :
                      'text-green-600'}`}>
                    {rem.status === 'acknowledged' ? <CheckCircle2 className="h-3 w-3" /> : null}
                    {rem.status === 'failed' ? <XCircle className="h-3 w-3" /> : null}
                    {rem.status}
                  </span>

                  {rem.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleStatusChange(rem.id, 'cancelled')}>
                        Cancel
                      </Button>
                      <Button size="sm" className="h-7 text-xs" onClick={() => handleStatusChange(rem.id, 'sent')}>
                        Mark Sent
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-xl bg-card">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-1">
            {hasFilters ? "No matching reminders" : "No reminders"}
          </h3>
          <p className="text-muted-foreground">
            {hasFilters ? "Try adjusting your filters." : "There are no active reminders."}
          </p>
        </div>
      )}
    </div>
  );
}
