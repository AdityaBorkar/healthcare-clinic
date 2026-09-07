import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/(erp)/audit-trail/")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Audit Trail (Shaun)" }],
	}),
});

function RouteComponent() {
	return <div>Hello "/(protected)/(erp)/audit-trail/"!</div>;
}
