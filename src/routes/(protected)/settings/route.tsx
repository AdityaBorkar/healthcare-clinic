import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Building2, GitBranch, Plug } from "lucide-react";

import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(protected)/settings")({
  component: RouteComponent,
});

const navItems = [
  {
    icon: Building2,
    label: "Organization",
    to: "/settings/organization" as const,
  },
  {
    icon: GitBranch,
    label: "Branches",
    to: "/settings/branches" as const,
  },
  {
    icon: Plug,
    label: "Connections",
    to: "/settings/connections" as const,
  },
];

function RouteComponent() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-64 border-r bg-muted/30 p-6">
        <h2 className="mb-6 font-semibold text-lg">Settings</h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} {...item} />
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export function NavLink({
  label,
  to,
  icon: Icon,
}: {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const pathname = Route.useMatch({
    select: (match) => match.pathname,
  });
  const isActive = pathname.startsWith(to);

  return (
    <Link
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 font-medium text-sm transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
      to={to}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
