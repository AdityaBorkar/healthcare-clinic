import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/(accounting)/sales/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/(accounting)/sales/"!</div>;
}
