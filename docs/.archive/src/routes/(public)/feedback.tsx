import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/feedback")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Feedback (Shaun)" }],
	}),
});

function RouteComponent() {
	return <div>Hello "/(public)/feedback"!</div>;
}
