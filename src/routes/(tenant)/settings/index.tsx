import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  ClipboardList,
  FileBarChart,
  History,
  Settings2,
  Shield,
  SlidersHorizontal,
  Ticket,
  Users,
  UsersRound,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/(tenant)/settings/")({
  component: SettingsPage,
});

const sections = [
  {
    items: [
      {
        description: "Organization profile, branding, and workspace defaults.",
        href: "/settings/general",
        icon: Settings2,
        label: "General",
      },
      {
        description: "Personal preferences and default behaviors.",
        href: "/settings/preferences",
        icon: SlidersHorizontal,
        label: "Preferences",
      },
    ],
    label: "Organization",
  },
  {
    items: [
      {
        description: "Manage the people who can access this workspace.",
        href: "/settings/users",
        icon: Users,
        label: "Users",
      },
      {
        description: "Create and assign permission roles.",
        href: "/settings/roles",
        icon: Shield,
        label: "Roles",
      },
      {
        description: "Model your organization's hierarchy and teams.",
        href: "/settings/branches",
        icon: UsersRound,
        label: "Organization Structure",
      },
    ],
    label: "Human Resources",
  },
  {
    items: [
      {
        description: "Review who signed in and when.",
        href: "/settings/access-history",
        icon: History,
        label: "Access History",
      },
      {
        description: "Track changes made across the workspace.",
        href: "/settings/audit-log",
        icon: ClipboardList,
        label: "Audit Log",
      },
      {
        description: "Generate and export workspace reports.",
        href: "/settings/reports",
        icon: FileBarChart,
        label: "Reports",
      },
    ],
    label: "Audit",
  },
  {
    items: [
      {
        description: "Manage support tickets from your users.",
        href: "/settings/tickets",
        icon: Ticket,
        label: "Tickets",
      },
      {
        description: "Author and organize help articles.",
        href: "/settings/knowledge-base",
        icon: BookOpen,
        label: "Knowledge Base",
      },
    ],
    label: "Support",
  },
] as const;

type Service = (typeof sections)[number]["items"][number];

function SettingsPage() {
  return (
    <main className="bg-stone-canvas p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <PageHeader
          description="Manage your workspace services and configuration."
          title="Settings"
        />

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.label}>
              <h2 className="mb-3 text-[10px] font-medium tracking-[0.14em] text-warm-gray uppercase">
                {section.label}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => (
                  <ServiceCard item={item} key={item.href} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

// Biome-ignore lint/style/useComponentExportOnlyModules: route modules export a Route config alongside render helpers
function ServiceCard({ item }: { item: Service }) {
  const Icon = item.icon;

  return (
    <Link className="group/card block rounded-lg" to={item.href}>
      <Card className="h-full shadow-[var(--shadow-md)] transition-colors hover:bg-muted">
        <CardHeader>
          <span className="flex size-10 items-center justify-center rounded-lg bg-sky-wash/40 text-cyan-edge">
            <Icon className="size-5 text-cyan-edge" />
          </span>
          <CardTitle>{item.label}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
          <CardAction>
            <ChevronRight className="size-4 text-warm-gray transition-transform group-hover/card:translate-x-0.5" />
          </CardAction>
        </CardHeader>
      </Card>
    </Link>
  );
}
