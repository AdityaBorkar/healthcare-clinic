import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/settings/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  return <TodoPage title="Reports" />;
}
