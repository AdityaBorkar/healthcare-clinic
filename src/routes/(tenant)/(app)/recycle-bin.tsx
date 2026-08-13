import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/(app)/recycle-bin")({
  component: RecycleBinPage,
});

function RecycleBinPage() {
  return <TodoPage title="Recycle Bin" />;
}
