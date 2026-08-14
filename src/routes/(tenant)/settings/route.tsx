import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

import { Route as BaseRoute } from "../route";
import { pm } from "@/aspen/client";
import { NotPrintable } from "@/components/not-printable";
import { SettingsHeader } from "@/components/settings-header";
import { SettingsSidebar } from "@/components/settings-sidebar";

export const Route = createFileRoute("/(tenant)/settings")({
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
        <SettingsSidebar onSignOut={handleSignOut} organization={organization} user={user} />
        <div className="flex min-w-0 flex-1 flex-col">
          <SettingsHeader />
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </NotPrintable>
  );
}
