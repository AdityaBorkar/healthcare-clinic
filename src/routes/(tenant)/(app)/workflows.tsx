import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/(app)/workflows")({
  component: WorkflowsPage,
});

function WorkflowsPage() {
  return <TodoPage title="Workflows" />;
}
