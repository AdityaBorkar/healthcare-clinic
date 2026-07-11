import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/hr/team-members")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/hr/team-members"!</div>;
}
