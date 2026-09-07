import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/reports/")({
	component: ReportsComponent,
	head: () => ({
		meta: [{ title: "Reports (Shaun)" }],
	}),
});

function ReportsComponent() {
	return (
		<div className="p-6">
			<h1 className="font-bold text-2xl">Reports</h1>
			<p className="text-muted-foreground">
				Generate and view system reports and analytics.
			</p>
		</div>
	);
}
