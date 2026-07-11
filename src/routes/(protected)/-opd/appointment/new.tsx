import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/opd/appointment/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/opd/appointment/new"!</div>;
}
