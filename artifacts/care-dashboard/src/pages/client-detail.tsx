import {
  useGetClient,
  getGetClientQueryKey,
  useUpdateClient,
  useGetCaregivers,
  useCreateAppointment,
  getGetAppointmentsQueryKey,
} from "@workspace/api-client-react";
import { useGetAppointmentsFiltered, getGetAppointmentsFilteredQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, ArrowLeft, User, Phone, MapPin, Calendar, Activity, Edit, Clock, Plus, X, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const APPT_TYPES = [
  { value: "daily_assistance", label: "Daily Assistance" },
  { value: "companionship", label: "Companionship" },
  { value: "transportation", label: "Transportation" },
  { value: "telehealth", label: "Telehealth" },
  { value: "medication_management", label: "Medication Management" },
  { value: "personal_care", label: "Personal Care" },
];

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  confirmed: "bg-green-100 text-green-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-orange-100 text-orange-800",
};

function toLocalDatetimeValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function ClientDetail() {
  const params = useParams<{ id: string }>();
  const clientId = parseInt(params.id || "0", 10);

  const { data: client, isLoading } = useGetClient(clientId, {
    query: { enabled: !!clientId, queryKey: getGetClientQueryKey(clientId) },
  });

  const { data: appointments, isLoading: apptLoading } = useGetAppointmentsFiltered(
    { clientId: String(clientId) },
    { enabled: !!clientId, queryKey: getGetAppointmentsFilteredQueryKey({ clientId: String(clientId) }) }
  );

  const { data: caregivers } = useGetCaregivers();

  const updateClient = useUpdateClient();
  const createAppointment = useCreateAppointment();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [showBooking, setShowBooking] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  const [form, setForm] = useState({
    type: "daily_assistance",
    caregiverId: "",
    scheduledAt: toLocalDatetimeValue(tomorrow),
    durationMinutes: "60",
    notes: "",
  });

  const handleSaveNotes = () => {
    updateClient.mutate({ id: clientId, data: { notes } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetClientQueryKey(clientId) });
        setEditingNotes(false);
        toast({ title: "Notes updated" });
      },
    });
  };

  const handleBookAppointment = () => {
    createAppointment.mutate({
      data: {
        clientId,
        caregiverId: form.caregiverId ? parseInt(form.caregiverId, 10) : null,
        type: form.type as never,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        durationMinutes: parseInt(form.durationMinutes, 10),
        notes: form.notes || null,
        status: "scheduled",
      },
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAppointmentsFilteredQueryKey({ clientId: String(clientId) }) });
        queryClient.invalidateQueries({ queryKey: getGetAppointmentsQueryKey() });
        setShowBooking(false);
        setForm({ type: "daily_assistance", caregiverId: "", scheduledAt: toLocalDatetimeValue(tomorrow), durationMinutes: "60", notes: "" });
        toast({ title: "Appointment scheduled", description: `${APPT_TYPES.find(t => t.value === form.type)?.label} added for ${client?.name}.` });
      },
      onError: () => {
        toast({ title: "Failed to schedule appointment", variant: "destructive" });
      },
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

  if (!client) return <div>Client not found</div>;

  const upcoming = (appointments ?? []).filter(a => a.status !== "completed" && a.status !== "cancelled" && a.status !== "no_show");
  const past = (appointments ?? []).filter(a => a.status === "completed" || a.status === "cancelled" || a.status === "no_show");

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
            <Badge variant={client.status === "active" ? "default" : "secondary"}>
              {client.status.replace("_", " ")}
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
              <span className="text-sm text-muted-foreground flex items-center gap-2"><Phone className="h-4 w-4" /> Phone</span>
              <span className="font-medium">{client.phone}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" /> Address</span>
              <span className="font-medium">{client.address}</span>
            </div>
            {client.dateOfBirth && (
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> Date of Birth</span>
                <span className="font-medium">{new Date(client.dateOfBirth).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex flex-col gap-1 pt-4 border-t">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" /> Emergency Contact
              </span>
              <span className="font-medium">{client.emergencyContact || "Not provided"}</span>
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
                onClick={() => { setNotes(client.notes || ""); setEditingNotes(!editingNotes); }}
              >
                <Edit className="h-4 w-4 mr-2" /> {editingNotes ? "Cancel" : "Edit"}
              </Button>
            </CardHeader>
            <CardContent>
              {editingNotes ? (
                <div className="space-y-3">
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
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
                Care Plan Details
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

      {/* Appointments section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Appointments
            {!apptLoading && appointments && (
              <span className="text-sm font-normal text-muted-foreground ml-1">({appointments.length} total)</span>
            )}
          </CardTitle>
          <Button size="sm" onClick={() => setShowBooking(v => !v)}>
            {showBooking ? <><X className="h-4 w-4 mr-2" />Cancel</> : <><Plus className="h-4 w-4 mr-2" />Schedule Appointment</>}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Booking form */}
          {showBooking && (
            <div className="border rounded-xl p-5 bg-muted/30 space-y-4">
              <h3 className="font-semibold text-base">New Appointment for {client.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Visit Type</Label>
                  <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {APPT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Caregiver <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <Select value={form.caregiverId} onValueChange={v => setForm(f => ({ ...f, caregiverId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {(caregivers ?? []).map(c => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.name} — {c.role.replace(/_/g, " ")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={form.scheduledAt}
                    onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Duration (minutes)</Label>
                  <Select value={form.durationMinutes} onValueChange={v => setForm(f => ({ ...f, durationMinutes: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["30", "60", "90", "120", "180", "240"].map(d => (
                        <SelectItem key={d} value={d}>{parseInt(d) >= 60 ? `${parseInt(d) / 60}h${parseInt(d) % 60 ? ` ${parseInt(d) % 60}m` : ""}` : `${d}m`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label>Notes <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <Textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Any special instructions or notes for this visit..."
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowBooking(false)}>Cancel</Button>
                <Button onClick={handleBookAppointment} disabled={createAppointment.isPending || !form.scheduledAt}>
                  {createAppointment.isPending ? "Scheduling..." : "Confirm Appointment"}
                </Button>
              </div>
            </div>
          )}

          {/* Upcoming appointments */}
          {apptLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          ) : upcoming.length === 0 && past.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>No appointments yet. Use the button above to schedule one.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Upcoming</p>
                  {upcoming.map(appt => (
                    <AppointmentRow key={appt.id} appt={appt} />
                  ))}
                </>
              )}
              {past.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-4">Past</p>
                  {past.slice(0, 5).map(appt => (
                    <AppointmentRow key={appt.id} appt={appt} />
                  ))}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AppointmentRow({ appt }: { appt: { id: number; type: string; scheduledAt: string; durationMinutes: number; status: string; caregiverName?: string | null } }) {
  const label = APPT_TYPES.find(t => t.value === appt.type)?.label ?? appt.type.replace(/_/g, " ");
  const statusColor = STATUS_COLORS[appt.status] ?? "bg-gray-100 text-gray-700";
  const isCompleted = appt.status === "completed";
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${isCompleted ? "opacity-60" : ""}`}>
      <div className="flex items-center gap-3">
        {isCompleted
          ? <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
          : <Calendar className="h-4 w-4 text-primary shrink-0" />}
        <div>
          <p className="font-medium text-sm">{label}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(appt.scheduledAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
            {" · "}{appt.durationMinutes >= 60 ? `${appt.durationMinutes / 60}h` : `${appt.durationMinutes}m`}
            {appt.caregiverName && ` · ${appt.caregiverName}`}
          </p>
        </div>
      </div>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
        {appt.status.replace(/_/g, " ")}
      </span>
    </div>
  );
}
