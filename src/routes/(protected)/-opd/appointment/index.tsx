import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/opd/appointment/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/opd/appointment/"!</div>;
}
