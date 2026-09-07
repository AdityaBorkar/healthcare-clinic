import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/(erp)/compliance/")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Compliance (Shaun)" }],
	}),
});

function RouteComponent() {
	return <div>Hello "/(app)/(erp)/compliance/"!</div>;
}
