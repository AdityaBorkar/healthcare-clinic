import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/settings/audit-log")({
  component: AuditLogPage,
});

function AuditLogPage() {
  return <TodoPage title="Audit Log" />;
}
