import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/(app)/documents")({
  component: DocumentsPage,
});

function DocumentsPage() {
  return <TodoPage title="All Documents" />;
}
