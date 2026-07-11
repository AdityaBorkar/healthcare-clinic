import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/tasks/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/tasks/new"!</div>;
}
