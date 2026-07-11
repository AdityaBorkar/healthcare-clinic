import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Settings, Users } from "lucide-react";

import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(protected)")({
  component: RouteComponent,
});

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    to: "/dashboard" as const,
  },
  {
    icon: Users,
    label: "HR",
    to: "/hr" as const,
  },
  {
    icon: Settings,
    label: "Settings",
    to: "/settings" as const,
  },
];

function RouteComponent() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/30 p-6">
        <h2 className="mb-6 font-semibold text-lg">Clinic</h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} {...item} />
          ))}
        </nav>
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

function NavLink({
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
