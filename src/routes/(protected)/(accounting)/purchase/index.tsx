import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/(accounting)/purchase/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/(accounting)/purchase/"!</div>;
}
