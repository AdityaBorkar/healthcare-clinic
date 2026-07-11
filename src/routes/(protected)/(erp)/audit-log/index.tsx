import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/(erp)/audit-log/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/(erp)/audit-log/"!</div>;
}
