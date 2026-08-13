import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="min-h-svh bg-stone-canvas">
      <Outlet />
    </main>
  );
}
