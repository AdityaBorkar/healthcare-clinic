import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/account/settings")({
  component: RouteComponent,
});

const sections = [
  { description: "Your name and contact details.", title: "Profile" },
  { description: "Interface preferences and defaults.", title: "Preferences" },
  { description: "Password and authentication settings.", title: "Security" },
  { description: "Manage active sessions and devices.", title: "Sessions" },
];

function RouteComponent() {
  return (
    <main className="bg-stone-canvas p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader
          description="Manage your personal account and preferences."
          title="Account settings"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map((section) => (
            <Card className="shadow-[var(--shadow-md)]" key={section.title}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
