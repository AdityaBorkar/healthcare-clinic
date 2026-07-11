import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/(erp)/alerts/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/(erp)/alerts/"!</div>;
}
