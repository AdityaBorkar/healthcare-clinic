import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/(app)/tasks")({
  component: TasksPage,
});

function TasksPage() {
  return <TodoPage tabs={["Diary", "Tasks", "Reminders", "Requests"]} title="Tasks" />;
}
