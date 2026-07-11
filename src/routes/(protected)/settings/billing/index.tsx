import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/settings/billing/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/settings/billing/"!</div>;
}
