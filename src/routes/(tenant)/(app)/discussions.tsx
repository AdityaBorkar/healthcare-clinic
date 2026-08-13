import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/(app)/discussions")({
  component: DiscussionsPage,
});

function DiscussionsPage() {
  return <TodoPage title="Discussions" />;
}
