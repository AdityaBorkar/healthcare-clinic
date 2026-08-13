import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/settings/preferences")({
  component: PreferencesPage,
});

function PreferencesPage() {
  return <TodoPage title="Preferences" />;
}
