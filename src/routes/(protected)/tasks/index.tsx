import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/tasks/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/tasks/"!</div>;
}
