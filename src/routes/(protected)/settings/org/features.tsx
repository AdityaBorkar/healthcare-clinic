import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/settings/org/features")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/settings/org/features"!</div>;
}
