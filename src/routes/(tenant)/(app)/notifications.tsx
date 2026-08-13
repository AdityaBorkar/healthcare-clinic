import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/(app)/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <TodoPage
      tabs={["Announcements", "Reminders", "Events"]}
      title="Notifications"
    />
  );
}
