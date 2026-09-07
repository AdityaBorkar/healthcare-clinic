import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/$branchId/(hmis)/inventory/")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Inventory (Shaun)" }],
	}),
});

function RouteComponent() {
	return <div>Hello "/(protected)/(hmis)/inventory/"!</div>;
}
