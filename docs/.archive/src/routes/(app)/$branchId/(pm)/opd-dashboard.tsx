import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/$branchId/(pm)/opd-dashboard")({
	component: DashboardComponent,
	head: () => ({
		meta: [{ title: "OPD Dashboard (Shaun)" }],
	}),
});

function DashboardComponent() {
	return (
		<div className="p-6">
			<h1 className="font-bold text-2xl">ERP Dashboard</h1>
			<p className="text-muted-foreground">Welcome to the ERP dashboard.</p>
		</div>
	);
}
