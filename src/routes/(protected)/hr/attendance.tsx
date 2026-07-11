import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/hr/attendance")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/hr/attendance"!</div>;
}
