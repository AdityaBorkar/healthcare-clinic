import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/settings/branches")({
  component: RouteComponent,
});

function RouteComponent() {
  return <TodoPage title="Branches" />;
}
