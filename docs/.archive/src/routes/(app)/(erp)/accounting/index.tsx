import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/(erp)/accounting/")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Accounting (Shaun)" }],
	}),
});

function RouteComponent() {
	return <div>Manage finances, accounting, and budgets.</div>;
}
