import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/crm/email/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/crm/email/"!</div>;
}
