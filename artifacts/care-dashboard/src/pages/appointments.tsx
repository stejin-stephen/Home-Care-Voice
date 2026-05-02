import { useGetAppointments, getGetAppointmentsQueryKey, useUpdateAppointment, useGetAppointmentsFiltered, getGetAppointmentsFilteredQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, User, UserCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useState, useMemo } from "react";

export default function Appointments() {
  const updateAppointment = useUpdateAppointment();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const filters = useMemo(() => ({
    status: filterStatus || undefined,
    type: filterType || undefined,
    dateFrom: filterDateFrom || undefined,
    dateTo: filterDateTo || undefined,
  }), [filterStatus, filterType, filterDateFrom, filterDateTo]);

  const { data: appointments, isLoading } = useGetAppointmentsFiltered(filters);
  const { data: allAppointments } = useGetAppointments();

  const appointmentTypes = useMemo(() => {
    if (!allAppointments) return [];
    return [...new Set(allAppointments.map(a => a.type))];
  }, [allAppointments]);

  const handleStatusChange = (id: number, status: any) => {
    updateAppointment.mutate({ id, data: { status } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAppointmentsFilteredQueryKey(filters) });
        queryClient.invalidateQueries({ queryKey: getGetAppointmentsQueryKey() });
        toast({ title: "Status updated" });
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "confirmed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "in_progress": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "completed": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "cancelled":
      case "no_show": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const hasFilters = !!(filterStatus || filterType || filterDateFrom || filterDateTo);

  const clearFilters = () => {
    setFilterStatus("");
    setFilterType("");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
        <p className="text-muted-foreground mt-1">Schedule and monitor care visits.</p>
      </div>

      <div className="flex flex-wrap gap-3 items-end p-4 bg-muted/40 rounded-xl border">
        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-xs text-muted-foreground font-medium">Status</label>
          <Select value={filterStatus || "all"} onValueChange={v => setFilterStatus(v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 bg-background">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-xs text-muted-foreground font-medium">Type</label>
          <Select value={filterType || "all"} onValueChange={v => setFilterType(v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 bg-background">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {appointmentTypes.map(t => (
                <SelectItem key={t} value={t}>{t.replace(/_/g, ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground font-medium">From</label>
          <Input
            type="date"
            value={filterDateFrom}
            onChange={e => setFilterDateFrom(e.target.value)}
            className="h-9 bg-background w-40"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground font-medium">To</label>
          <Input
            type="date"
            value={filterDateTo}
            onChange={e => setFilterDateTo(e.target.value)}
            className="h-9 bg-background w-40"
          />
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 gap-1 text-muted-foreground">
            <X className="h-4 w-4" /> Clear
          </Button>
        )}

        <span className="ml-auto text-xs text-muted-foreground self-end pb-1">
          {appointments ? `${appointments.length} result${appointments.length !== 1 ? "s" : ""}` : ""}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : appointments && appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <Card key={apt.id} className="overflow-hidden border-l-4" style={{ borderLeftColor: 'hsl(var(--primary))' }}>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="p-4 md:p-6 bg-muted/30 md:w-64 border-b md:border-b-0 md:border-r flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                      <Calendar className="h-5 w-5" />
                      {format(new Date(apt.scheduledAt), "MMM d, yyyy")}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground mt-2">
                      <Clock className="h-4 w-4" />
                      {format(new Date(apt.scheduledAt), "h:mm a")} ({apt.durationMinutes} min)
                    </div>
                  </div>

                  <div className="p-4 md:p-6 flex-1 flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4 flex-1">
                      <div>
                        <h3 className="text-lg font-semibold capitalize">{apt.type.replace(/_/g, ' ')}</h3>
                        <Badge variant="outline" className={`mt-2 ${getStatusColor(apt.status)} border-0`}>
                          {apt.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{apt.clientName || 'Unknown Client'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-4 w-4 text-muted-foreground" />
                          <span>{apt.caregiverName || 'Unassigned'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-48 shrink-0 flex flex-col justify-center">
                      <label className="text-xs text-muted-foreground mb-1 block">Update Status</label>
                      <Select value={apt.status} onValueChange={(val) => handleStatusChange(apt.id, val)}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="no_show">No Show</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-xl bg-card">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-1">
            {hasFilters ? "No matching appointments" : "No appointments"}
          </h3>
          <p className="text-muted-foreground">
            {hasFilters ? "Try adjusting your filters." : "No upcoming appointments scheduled."}
          </p>
        </div>
      )}
    </div>
  );
}
