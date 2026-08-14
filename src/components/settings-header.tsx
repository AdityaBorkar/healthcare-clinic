import { Link, useMatches } from "@tanstack/react-router";
import { Settings2 } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const breadcrumbLabels: Record<string, string> = {
  "/(tenant)/settings": "Settings",
  "/(tenant)/settings/access-history": "Access History",
  "/(tenant)/settings/audit-log": "Audit Log",
  "/(tenant)/settings/branches": "Branches",
  "/(tenant)/settings/general": "General",
  "/(tenant)/settings/knowledge-base": "Knowledge Base",
  "/(tenant)/settings/preferences": "Preferences",
  "/(tenant)/settings/reports": "Reports",
  "/(tenant)/settings/roles": "Roles",
  "/(tenant)/settings/tickets": "Tickets",
  "/(tenant)/settings/users/": "Users",
  "/(tenant)/settings/users/$id/edit": "Edit",
  "/(tenant)/settings/users/new": "New user",
};

type Breadcrumbs = {
  href: string;
  label: string;
};

type SettingsMatch = ReturnType<typeof useMatches>[number];

function resolveBreadcrumbLabel(match: SettingsMatch): string | null {
  const label = breadcrumbLabels[match.routeId];
  if (label) {
    return label;
  }

  if (match.routeId === "/(tenant)/settings/users/$id/") {
    const name = (match.loaderData as unknown as { name?: string } | null | undefined)?.name;
    return name ?? "User details";
  }

  return null;
}

function insertUsersCrumb(breadcrumbs: Breadcrumbs[]) {
  if (breadcrumbs.some((crumb) => crumb.href === "/settings/users")) {
    return;
  }

  const needsUsers = breadcrumbs.some(
    (crumb, index) => index > 0 && crumb.href.startsWith("/settings/users/"),
  );
  if (!needsUsers) {
    return;
  }

  breadcrumbs.splice(1, 0, { href: "/settings/users", label: "Users" });
}

export function SettingsHeader() {
  const matches = useMatches();

  const breadcrumbs: Breadcrumbs[] = [];

  for (const match of matches) {
    const label = resolveBreadcrumbLabel(match);
    if (label === null) {
      continue;
    }

    const rawHref = match.pathname;
    const href = rawHref === "/" ? rawHref : rawHref.replace(/\/+$/, "");
    if (breadcrumbs[breadcrumbs.length - 1]?.href === href) {
      continue;
    }

    breadcrumbs.push({ href, label });
  }

  insertUsersCrumb(breadcrumbs);

  return (
    <header className="sticky top-0 z-10 border-b border-stone-border bg-white/80 backdrop-blur-md">
      <div className="flex h-14 items-center gap-2 px-4 sm:px-6">
        <Settings2 className="size-4 shrink-0 text-ink-black" />
        <Breadcrumb aria-label="Breadcrumb" className="min-w-0 flex-1">
          <BreadcrumbList className="flex-nowrap">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <BreadcrumbItem className="min-w-0" key={crumb.href}>
                  {index > 0 ? <BreadcrumbSeparator /> : null}
                  {isLast ? (
                    <BreadcrumbPage className="min-w-0 truncate text-sm font-medium text-ink-black">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      render={
                        <Link
                          className="block truncate rounded px-1 py-0.5 text-warm-gray transition-colors hover:text-ink-black focus-visible:ring-2 focus-visible:ring-cyan-signal/30 focus-visible:outline-none"
                          to={crumb.href}
                        />
                      }
                    >
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
