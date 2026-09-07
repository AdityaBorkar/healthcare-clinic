import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/(erp)/sop-sla/")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "SOP & SLA (Shaun)" }],
	}),
});

function RouteComponent() {
	return <div>This Component is currently de-activated.</div>;
}
