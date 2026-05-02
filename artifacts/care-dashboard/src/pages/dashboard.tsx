import { useGetDashboardSummary, useGetDashboardActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneCall, Users, AlertTriangle, Bell, Clock, Activity, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary();
  const { data: activity, isLoading: loadingActivity } = useGetDashboardActivity();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of today's care operations.</p>
      </div>

      {loadingSummary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : summary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Calls Today</CardTitle>
              <PhoneCall className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.callsToday}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {summary.callsThisWeek} calls this week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.activeClients}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {summary.activeCaregivers} active caregivers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Escalations</CardTitle>
              <AlertTriangle className={`h-4 w-4 ${summary.openEscalations > 0 ? 'text-destructive' : 'text-primary'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.openEscalations}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {summary.criticalEscalations} critical
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reminders Due</CardTitle>
              <Bell className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.pendingReminders}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Pending reminders
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingActivity ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : activity && activity.length > 0 ? (
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  {activity.slice(0, 8).map((item, index) => (
                    <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-muted text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        {item.type === 'call' && <PhoneCall className="h-4 w-4" />}
                        {item.type === 'appointment' && <Clock className="h-4 w-4" />}
                        {item.type === 'reminder' && <Bell className="h-4 w-4" />}
                        {item.type === 'escalation' && <AlertTriangle className="h-4 w-4" />}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{item.title}</span>
                          <span className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        {item.clientName && (
                          <div className="mt-2 text-xs font-medium text-primary">
                            Client: {item.clientName}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No recent activity found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {summary && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Call Outcomes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(summary.callsByOutcome || {}).map(([outcome, count]) => (
                      <div key={outcome} className="flex items-center justify-between">
                        <div className="text-sm capitalize">{outcome.replace(/_/g, ' ')}</div>
                        <div className="font-medium text-sm">{count}</div>
                      </div>
                    ))}
                    {Object.keys(summary.callsByOutcome || {}).length === 0 && (
                      <div className="text-sm text-muted-foreground">No call outcome data</div>
                    )}
                  </div>
                  <div className="mt-6 pt-4 border-t border-border">
                    <Link href="/call-logs">
                      <div className="text-sm text-primary font-medium flex items-center gap-1 cursor-pointer hover:underline">
                        View all call logs <ArrowRight className="h-4 w-4" />
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Call Intents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(summary.callsByIntent || {}).map(([intent, count]) => (
                      <div key={intent} className="flex items-center justify-between">
                        <div className="text-sm capitalize">{intent.replace(/_/g, ' ')}</div>
                        <div className="font-medium text-sm">{count}</div>
                      </div>
                    ))}
                    {Object.keys(summary.callsByIntent || {}).length === 0 && (
                      <div className="text-sm text-muted-foreground">No call intent data</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
