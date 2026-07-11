import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/(healthcare-erp)/patients/")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  return <div>Hello "/(protected)/(healthcare-erp)/patients/"!</div>;
}
