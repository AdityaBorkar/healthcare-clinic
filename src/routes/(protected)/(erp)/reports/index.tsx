import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/(erp)/reports/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/(erp)/reports/"!</div>;
}
