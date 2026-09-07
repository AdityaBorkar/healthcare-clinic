import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/$branchId/(pm)/medical-records/")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Medical Records (Shaun)" }],
	}),
});

function RouteComponent() {
	return <div>Hello "/(protected)/(hmis)/medical-records/"!</div>;
}
