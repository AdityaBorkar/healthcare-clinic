import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/pharmacy/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/pharmacy/"!</div>;
}
