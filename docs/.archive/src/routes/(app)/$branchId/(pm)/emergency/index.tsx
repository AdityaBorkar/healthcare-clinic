import { createFileRoute } from "@tanstack/react-router";

import { DisabledModulePage } from "#/components/pages/disabled-module";

export const Route = createFileRoute("/(app)/$branchId/(pm)/emergency/")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Emergency (Shaun)" }],
	}),
});

function RouteComponent() {
	return <DisabledModulePage />;
}
