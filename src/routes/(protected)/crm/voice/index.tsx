import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/crm/voice/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/crm/voice/"!</div>;
}
