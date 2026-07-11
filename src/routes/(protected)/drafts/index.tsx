import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/drafts/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/drafts/"!</div>;
}
