import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/(erp)/compliance/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/(erp)/compliance/"!</div>;
}
