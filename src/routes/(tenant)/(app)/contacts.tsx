import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/(app)/contacts")({
  component: ContactsPage,
});

function ContactsPage() {
  return <TodoPage title="Contacts" />;
}
