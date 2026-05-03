import React from "react";
import {
  ArrowRight,
  Phone,
  Clock,
  Globe,
  Shield,
  Activity,
  Users,
  Calendar,
  CheckCircle2,
  Bell,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const base = import.meta.env.BASE_URL;

  const features = [
    {
      icon: Globe,
      title: "Native Multilingual",
      description:
        "Clara speaks English, Spanish, Vietnamese, Mandarin, and Tagalog fluently — understanding cultural nuances and medical terminology in your community's languages.",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description:
        "Caregivers call to check shifts, report delays, or log off. Clara updates your schedule automatically and alerts you only when coverage is at risk.",
    },
    {
      icon: Shield,
      title: "Urgent Escalations",
      description:
        "Not all calls are equal. Clara recognizes emergencies, distress, or severe complaints and instantly routes them to your on-call coordinator's phone.",
    },
    {
      icon: Bell,
      title: "Automated Reminders",
      description:
        "Clara proactively calls clients and caregivers before visits — confirming appointments, reducing no-shows, and keeping everyone aligned without manual follow-up.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Call Logs",
      description:
        "Every conversation is transcribed and logged instantly in the CareConnect dashboard — searchable, timestamped, and available to your whole team.",
    },
    {
      icon: MessageSquare,
      title: "After-Hours Coverage",
      description:
        "Clara never sleeps, never calls in sick, and never puts a family on hold. 24/7 live voice coverage means your agency is always reachable.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Clara answers — every call, every time",
      description:
        "A family member calls at 2 AM. Clara picks up immediately, greets them in their language, and handles the conversation with warmth and professionalism — just like your best coordinator would.",
    },
    {
      number: "02",
      title: "Every call is logged and transcribed instantly",
      description:
        "The moment a call ends, it appears in your CareConnect dashboard — fully transcribed, timestamped, and searchable. No more handwritten notes or missed details.",
    },
    {
      number: "03",
      title: "Clara resolves it — or escalates to you",
      description:
        "Routine calls (schedule checks, reminders, shift confirmations) are handled and closed. Anything urgent — a missed caregiver, a medical concern — is escalated to your on-call coordinator within 2 minutes.",
    },
  ];

  const stats = [
    { value: "24/7", label: "Always available" },
    { value: "5", label: "Languages spoken" },
    { value: "< 2 min", label: "Escalation time" },
    { value: "0", label: "Missed calls after hours" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Phone className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              CareConnect
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
            <a href="#features" className="hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">
              How it works
            </a>
            <a href="#why-clara" className="hover:text-primary transition-colors">
              Why Clara
            </a>
          </div>
          <Button asChild className="rounded-full shadow-sm">
            <a href="mailto:hello@careconnect.ai">Book a Demo</a>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(163,204,188,0.3),transparent_40%)]" />
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-primary text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Clara is answering calls right now
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            Meet Clara, your{" "}
            <span className="text-primary relative whitespace-nowrap">
              24/7 AI Care Coordinator.
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-secondary/30"
                viewBox="0 0 200 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 7.5C45.5 2.5 110.5 -1.5 198 7.5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className="text-xl text-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            CareConnect gives your home care agency an AI voice assistant that answers every call, in 5 languages, around the clock — handling scheduling, reminders, and urgent escalations so your team can focus on delivering care.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full h-14 px-8 text-base shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <a href="mailto:hello@careconnect.ai">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-14 px-8 text-base border-border/80 bg-background/50 hover:bg-accent/50 transition-all"
              asChild
            >
              <a href="mailto:hello@careconnect.ai">Book a Demo</a>
            </Button>
          </div>

          <div className="mt-16 mx-auto rounded-3xl overflow-hidden border border-border shadow-2xl relative">
            <img
              src={`${base}hero.png`}
              alt="Care coordinator helping a client"
              className="w-full object-cover aspect-video"
            />
            <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="text-primary w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                  Translating live
                </p>
                <p className="text-sm font-bold text-foreground">
                  English to Vietnamese
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 border-y border-border bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-foreground/60 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="why-clara" className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Real families can't leave voicemails for urgent care.
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
                When a family member calls about a missed shift or a sudden
                change in condition, they need a voice, not a beep. Every missed
                call is a break in trust — and a liability for your agency.
              </p>
              <ul className="space-y-4">
                {[
                  "80% of calls to home care agencies go to voicemail after hours",
                  "Care coordinators spend 4+ hours a day on phone tag and follow-ups",
                  "Language barriers delay critical schedule changes for days",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Activity className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
                    <span className="text-primary-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary-foreground/10 p-8 rounded-3xl border border-primary-foreground/20 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-6">The CareConnect Difference</h3>
              <div className="space-y-6">
                <div className="flex gap-4 items-center">
                  <div className="text-3xl font-bold text-secondary">0</div>
                  <div className="text-sm font-medium text-primary-foreground/80 leading-tight">
                    Missed calls after hours<br />with Clara on duty
                  </div>
                </div>
                <div className="w-full h-px bg-primary-foreground/10" />
                <div className="flex gap-4 items-center">
                  <div className="text-3xl font-bold text-secondary">5</div>
                  <div className="text-sm font-medium text-primary-foreground/80 leading-tight">
                    Languages spoken<br />fluently, 24/7
                  </div>
                </div>
                <div className="w-full h-px bg-primary-foreground/10" />
                <div className="flex gap-4 items-center">
                  <div className="text-3xl font-bold text-secondary">2m</div>
                  <div className="text-sm font-medium text-primary-foreground/80 leading-tight">
                    Average time to<br />escalate emergencies
                  </div>
                </div>
                <div className="w-full h-px bg-primary-foreground/10" />
                <div className="flex gap-4 items-center">
                  <div className="text-3xl font-bold text-secondary">4h</div>
                  <div className="text-sm font-medium text-primary-foreground/80 leading-tight">
                    Saved per coordinator<br />each day
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              A team member who never sleeps.
            </h2>
            <p className="text-lg text-foreground/70">
              Clara integrates into your existing workflow — handling the calls
              that used to fall through the cracks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="bg-card border-border shadow-sm hover:shadow-md transition-all"
              >
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-accent text-primary flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-accent/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Up and running in an afternoon.
            </h2>
            <p className="text-lg text-foreground/70">
              No new software to train, no hardware to install. Clara fits into
              the way your agency already works.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col">
                <div className="text-5xl font-bold text-primary/20 mb-4 leading-none">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {step.description}
                </p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Break / Audio Demo */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <img
            src={`${base}ai-wave.png`}
            alt="AI voice technology"
            className="w-64 h-64 object-cover rounded-full mx-auto mb-10 shadow-xl border-4 border-border"
          />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            It sounds like human warmth.
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-10">
            Clara handles panicked scheduling changes, appointment reminders, and
            language barriers at 2 AM — with the same calm, caring tone your
            agency expects from its best coordinators.
          </p>
          <div className="inline-flex items-center gap-4 bg-accent/40 px-6 py-4 rounded-full shadow-sm border border-border">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Phone className="w-4 h-4 text-primary-foreground fill-current" />
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 20 }).map((_, j) => (
                <div
                  key={j}
                  className="w-1 rounded-full bg-primary/40"
                  style={{ height: `${8 + Math.sin(j * 0.9) * 8}px` }}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground/60">
              Live call in progress
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-primary relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-4">
            Built for home care agencies
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to stop missing calls?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10">
            Join agencies already using CareConnect to provide better, faster,
            more responsive care — one call at a time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full h-14 px-10 text-lg bg-background text-primary hover:bg-background/90 shadow-xl"
              asChild
            >
              <a href="mailto:hello@careconnect.ai">
                Book a Demo <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="rounded-full h-14 px-10 text-lg text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <a href="mailto:hello@careconnect.ai">Get Started Today</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">CareConnect</span>
              </div>
              <p className="text-foreground/60 text-sm leading-relaxed">
                AI-powered voice assistants for home care agencies — so every
                family gets a voice, not a voicemail.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-foreground mb-1">Product</span>
              <a href="#features" className="text-foreground/60 hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-foreground/60 hover:text-primary transition-colors">How it works</a>
              <a href="mailto:hello@careconnect.ai" className="text-foreground/60 hover:text-primary transition-colors">Book a Demo</a>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-foreground mb-1">Company</span>
              <a href="mailto:hello@careconnect.ai" className="text-foreground/60 hover:text-primary transition-colors">Contact</a>
              <span className="text-foreground/40">Privacy Policy</span>
              <span className="text-foreground/40">Terms of Service</span>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-foreground/50 text-sm">
            <span>© {new Date().getFullYear()} CareConnect. All rights reserved.</span>
            <a
              href="mailto:hello@careconnect.ai"
              className="text-primary font-medium hover:underline"
            >
              hello@careconnect.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
