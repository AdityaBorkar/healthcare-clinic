import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/settings/tickets")({
  component: TicketsPage,
});

function TicketsPage() {
  return <TodoPage title="Tickets" />;
}
