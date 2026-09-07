import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/legal")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Privacy Policy (Shaun)" }],
	}),
});

function RouteComponent() {
	return <div>Hello "/(public)/privacy-policy"!</div>;
}
