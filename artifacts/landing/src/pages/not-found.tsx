import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export default function NotFound() {
  const base = import.meta.env.BASE_URL;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-center px-4">
      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-6">
        <Phone className="w-6 h-6 text-primary-foreground" />
      </div>
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-foreground mb-3">Page not found</h2>
      <p className="text-foreground/60 mb-8 max-w-sm">
        The page you're looking for doesn't exist. Clara probably answered a call
        and forgot to leave a note.
      </p>
      <Button asChild className="rounded-full">
        <a href={base}>Back to CareConnect</a>
      </Button>
    </div>
  );
}
