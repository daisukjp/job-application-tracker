import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Applications", href: "/applications" },
  { label: "New Application", href: "/applications/new" },
  { label: "Settings", href: "/settings" },
  { label: "Follow-ups", href: "/follow-ups" }
];

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="md:grid md:min-h-screen md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r bg-background/80 px-6 py-8 md:flex md:flex-col md:gap-8">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Job Tracker
            </p>
            <p className="text-lg font-semibold">Job Application Tracker</p>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex min-h-screen flex-col">
          <header className="border-b bg-background/80 px-6 py-4 md:hidden">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Job Tracker
              </p>
              <p className="text-base font-semibold">Job Application Tracker</p>
            </div>
            <nav className="mt-4 flex flex-wrap gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>
          <main className="flex-1 px-6 py-8 md:px-10">
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
