import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/hr/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/hr/"!</div>;
}
