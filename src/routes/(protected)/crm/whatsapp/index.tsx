import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/crm/whatsapp/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/crm/whatsapp/"!</div>;
}
