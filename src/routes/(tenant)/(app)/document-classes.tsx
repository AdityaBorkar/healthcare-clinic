import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/(app)/document-classes")({
  component: DocumentClassesPage,
});

function DocumentClassesPage() {
  return <TodoPage title="Document Classes" />;
}
