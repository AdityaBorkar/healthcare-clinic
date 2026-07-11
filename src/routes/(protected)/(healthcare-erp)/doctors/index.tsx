import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/(healthcare-erp)/doctors/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/(healthcare-erp)/doctors/"!</div>;
}
