import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/(accounting)/chart/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/(accounting)/chart/"!</div>;
}
