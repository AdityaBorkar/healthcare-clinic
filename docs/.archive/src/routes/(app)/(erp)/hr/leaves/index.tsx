import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/(erp)/hr/leaves/")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Leaves (Shaun)" }],
	}),
});

function RouteComponent() {
	return <div>Hello "/hr/leaves/"!</div>;
}
