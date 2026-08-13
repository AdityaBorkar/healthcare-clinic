import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/settings/access-history")({
  component: AccessHistoryPage,
});

function AccessHistoryPage() {
  return <TodoPage title="Access History" />;
}
