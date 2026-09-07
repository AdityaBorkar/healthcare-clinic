import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/contact")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Contact (Shaun)" }],
	}),
});

function RouteComponent() {
	return <div>Hello "/(public)/contact"!</div>;
}
