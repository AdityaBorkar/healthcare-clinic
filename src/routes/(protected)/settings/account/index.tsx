import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/settings/account/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/settings/account/"!</div>;
}
