import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/$branchId/(hmis)/beds/")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Beds (Shaun)" }],
	}),
});

function RouteComponent() {
	return <div>Hello "/(protected)/(hmis)/beds/"!</div>;
}
