import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/$branchId/(pm)/nursing")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Patient Care (Shaun)" }],
	}),
});

function RouteComponent() {
	return <div>Hello "/(protected)/(pm)/patient-care"!</div>;
}
