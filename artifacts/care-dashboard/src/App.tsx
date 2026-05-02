import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/dashboard";
import Clients from "@/pages/clients";
import ClientDetail from "@/pages/client-detail";
import Caregivers from "@/pages/caregivers";
import Appointments from "@/pages/appointments";
import CallLogs from "@/pages/call-logs";
import Reminders from "@/pages/reminders";
import Escalations from "@/pages/escalations";
import VoiceAgent from "@/pages/voice-agent";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/clients" component={Clients} />
        <Route path="/clients/:id" component={ClientDetail} />
        <Route path="/caregivers" component={Caregivers} />
        <Route path="/appointments" component={Appointments} />
        <Route path="/call-logs" component={CallLogs} />
        <Route path="/reminders" component={Reminders} />
        <Route path="/escalations" component={Escalations} />
        <Route path="/voice-agent" component={VoiceAgent} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
