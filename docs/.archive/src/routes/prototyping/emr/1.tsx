import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/prototyping/emr/1")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/prototyping/emr/1"!</div>;
}
