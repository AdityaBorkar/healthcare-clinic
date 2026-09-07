import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/(erp)/accounting/sales/")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Sales (Shaun)" }],
	}),
});

function RouteComponent() {
	return (
		<div>
			Sales orders, invoices, and customer management. Medical billing,
			insurance claims, and payments.
		</div>
	);
}
