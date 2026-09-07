import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/$branchId/(hmis)/lab/")({
	component: LabComponent,
	head: () => ({
		meta: [{ title: "Laboratory (Shaun)" }],
	}),
});

function LabComponent() {
	return (
		<div className="p-6">
			<h1 className="font-bold text-2xl">Laboratory</h1>
			<p className="text-muted-foreground">
				Lab orders, results, and sample tracking.
			</p>
		</div>
	);
}
