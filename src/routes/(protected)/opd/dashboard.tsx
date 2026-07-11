import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/opd/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/opd/dashboard"!</div>;
}
