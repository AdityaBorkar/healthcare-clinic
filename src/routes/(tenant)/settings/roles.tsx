import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/settings/roles")({
  component: RolesPage,
});

function RolesPage() {
  return <TodoPage title="Roles" />;
}
