import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/dashboard")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Dashboard (Shaun)" }],
	}),
});

function RouteComponent() {
	return <div>Customized Dashboard for Each User</div>;
}
