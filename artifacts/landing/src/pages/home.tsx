import React from "react";
import { ArrowRight, Phone, Clock, Globe, Shield, Activity, Users, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const base = import.meta.env.BASE_URL;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Phone className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">CareConnect</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Stories</a>
          </div>
          <Button asChild className="rounded-full shadow-sm">
            <a href="mailto:hello@careconnect.ai">Meet Clara</a>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(163,204,188,0.3),transparent_40%)]" />
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-primary text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Clara is answering calls right now in San Jose
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            The clinic that <br/>
            <span className="text-primary relative whitespace-nowrap">
              actually answers
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary/30" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 7.5C45.5 2.5 110.5 -1.5 198 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
            </span>
            <br/>the phone.
          </h1>
          <p className="text-xl text-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            CareConnect provides your home care agency with an AI Voice Assistant that handles scheduling, reminders, and urgent escalations 24/7 in 5 languages. Focus on people, not phones.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-lg hover:shadow-xl transition-all" asChild>
              <a href="mailto:hello@careconnect.ai">
                Hire Clara Today <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base border-border/80 bg-background/50 hover:bg-accent/50 transition-all">
              Watch a Demo
            </Button>
          </div>
          
          <div className="mt-16 mx-auto rounded-3xl overflow-hidden border border-border shadow-2xl relative">
            <img src={`${base}hero.png`} alt="Care coordinator helping a client" className="w-full object-cover aspect-video" />
            <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="text-primary w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Translating live</p>
                <p className="text-sm font-bold text-foreground">English to Vietnamese</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Real families can't leave voicemails for urgent care.</h2>
              <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
                When a family member calls about a missed shift or a sudden change in condition, they need a voice, not a beep. Every missed call is a break in trust.
              </p>
              <ul className="space-y-4">
                {[
                  "80% of calls to home care agencies go to voicemail after hours",
                  "Care coordinators spend 4 hours a day just playing phone tag",
                  "Language barriers delay critical schedule changes by days"
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
                  <div className="text-sm font-medium text-primary-foreground/80 leading-tight">Missed calls after<br/>hours with Clara</div>
                </div>
                <div className="w-full h-px bg-primary-foreground/10" />
                <div className="flex gap-4 items-center">
                  <div className="text-3xl font-bold text-secondary">5</div>
                  <div className="text-sm font-medium text-primary-foreground/80 leading-tight">Languages spoken<br/>fluently 24/7</div>
                </div>
                <div className="w-full h-px bg-primary-foreground/10" />
                <div className="flex gap-4 items-center">
                  <div className="text-3xl font-bold text-secondary">2m</div>
                  <div className="text-sm font-medium text-primary-foreground/80 leading-tight">Average time to<br/>escalate emergencies</div>
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
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">A team member who never sleeps.</h2>
            <p className="text-lg text-foreground/70">Clara integrates seamlessly into your existing workflows, treating your clients with the warmth and respect they deserve.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-accent text-primary flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Native Multilingual</h3>
                <p className="text-foreground/70 leading-relaxed">
                  Clara speaks English, Spanish, Vietnamese, Mandarin, and Tagalog fluently, understanding cultural nuances and medical terminology in San Jose's diverse communities.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-accent text-primary flex items-center justify-center mb-6">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Smart Scheduling</h3>
                <p className="text-foreground/70 leading-relaxed">
                  Caregivers can call to check their shifts, report delays, or log off. Clara updates your scheduling software automatically and alerts you only when coverage drops.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-accent text-primary flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Urgent Escalations</h3>
                <p className="text-foreground/70 leading-relaxed">
                  Not all calls are equal. Clara recognizes distress, medical emergencies, or severe complaints and instantly routes them to your on-call coordinator's cell phone.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Visual Break */}
      <section className="py-24 bg-accent/30 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <img src={`${base}ai-wave.png`} alt="AI voice technology" className="w-64 h-64 object-cover rounded-full mx-auto mb-10 shadow-xl border-4 border-background" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">It sounds like human warmth.</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-10">
            Listen to how Clara handles a panicked scheduling change from a Vietnamese-speaking family member at 2:00 AM.
          </p>
          <div className="inline-flex items-center gap-4 bg-background px-6 py-4 rounded-full shadow-md border border-border cursor-not-allowed opacity-80">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Phone className="w-4 h-4 text-primary-foreground fill-current" />
            </div>
            <div className="h-6 w-48 bg-accent rounded overflow-hidden flex items-center">
              <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDEyIEMxMCAxMiAxMCAwIDIwIDAgQzMwIDAgMzAgMTIgNDAgMTIgQzUwIDEyIDUwIDI0IDYwIDI0IEM3MCAyNCA3MCAxMiA4MCAxMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTYzIDI5JSAzNCUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')] bg-repeat-x opacity-50"></div>
            </div>
            <span className="text-sm font-medium text-foreground/50">Audio Demo</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-primary relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">Ready to stop missing calls?</h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Join the San Jose agencies already using CareConnect to provide better, faster, more responsive care.
          </p>
          <Button size="lg" className="rounded-full h-14 px-10 text-lg bg-background text-primary hover:bg-background/90 shadow-xl" asChild>
            <a href="mailto:hello@careconnect.ai">Talk to our team</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 border-t border-border">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-foreground/60 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground">CareConnect</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="mailto:hello@careconnect.ai" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
