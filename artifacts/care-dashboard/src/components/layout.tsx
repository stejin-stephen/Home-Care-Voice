import { Link, useLocation } from "wouter";
import { 
  Home, 
  Users, 
  UserCircle, 
  Calendar, 
  PhoneCall, 
  Bell, 
  AlertTriangle, 
  Settings 
} from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Caregivers", href: "/caregivers", icon: UserCircle },
    { name: "Appointments", href: "/appointments", icon: Calendar },
    { name: "Call Logs", href: "/call-logs", icon: PhoneCall },
    { name: "Reminders", href: "/reminders", icon: Bell },
    { name: "Escalations", href: "/escalations", icon: AlertTriangle },
    { name: "Voice Agent", href: "/voice-agent", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-sidebar border-r border-sidebar-border flex-shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-sidebar-primary tracking-tight">CareConnect</h1>
          <p className="text-sm text-sidebar-foreground/70 mt-1">Home Care Operations</p>
        </div>
        <nav className="px-4 pb-6 space-y-1 flex flex-row md:flex-col overflow-x-auto md:overflow-visible">
          {navigation.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href}>
                <div
                  data-testid={`nav-${item.name.toLowerCase().replace(" ", "-")}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70"}`} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
