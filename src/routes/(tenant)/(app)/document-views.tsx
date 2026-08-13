import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/(app)/document-views")({
  component: DocumentViewsPage,
});

function DocumentViewsPage() {
  return <TodoPage title="Document Views" />;
}
