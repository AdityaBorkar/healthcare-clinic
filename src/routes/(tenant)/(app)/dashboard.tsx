import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/(tenant)/(app)/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="bg-stone-canvas p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader
          actions={
            <Button>
              <Plus />
              New document
            </Button>
          }
          description="Overview of your workspace activity."
          title="Dashboard"
        />

        <Card className="bg-stone-muted/20">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-sky-wash/40">
              <LayoutDashboard className="size-6 text-cyan-edge" />
            </span>
            <CardTitle className="text-lg text-ink-black">Dashboard coming soon</CardTitle>
            <p className="max-w-sm text-sm text-warm-gray">
              Workspace activity, recent documents, and pending approvals will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
