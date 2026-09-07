import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/$branchId/(hmis)/hmis-dashboard")({
	component: HMISDashboardComponent,
	head: () => ({
		meta: [{ title: "HMIS Dashboard (Shaun)" }],
	}),
});

function HMISDashboardComponent() {
	return (
		<div className="p-6">
			<h1 className="font-bold text-2xl">HMIS Dashboard</h1>
			<p className="text-muted-foreground">
				Hospital Management Information System dashboard.
			</p>
		</div>
	);
}
