import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

import { Route as BaseRoute } from "../route";
import { pm } from "@/aspen/client";
import { NotPrintable } from "@/components/not-printable";
import { TenantSidebar } from "@/components/tenant-sidebar";

export const Route = createFileRoute("/(tenant)/(app)")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { organization, user } = BaseRoute.useRouteContext();

  const handleSignOut = useCallback(async () => {
    await pm.auth.client.signOut();
    navigate({ to: "/" });
  }, [navigate]);

  return (
    <NotPrintable>
      <div className="flex min-h-svh flex-col bg-stone-canvas text-ink-black md:flex-row">
        <TenantSidebar onSignOut={handleSignOut} organization={organization} user={user} />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </NotPrintable>
  );
}
