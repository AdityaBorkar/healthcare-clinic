import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/(erp)/analytics/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/(erp)/analytics/"!</div>;
}
