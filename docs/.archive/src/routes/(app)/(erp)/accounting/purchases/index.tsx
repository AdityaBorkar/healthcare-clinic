import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/(erp)/accounting/purchases/")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Purchases (Shaun)" }],
	}),
});

function RouteComponent() {
	return <div>Purchase orders, vendor management, and procurement.</div>;
}
