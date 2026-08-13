import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/settings/knowledge-base")({
  component: KnowledgeBasePage,
});

function KnowledgeBasePage() {
  return <TodoPage title="Knowledge Base" />;
}
