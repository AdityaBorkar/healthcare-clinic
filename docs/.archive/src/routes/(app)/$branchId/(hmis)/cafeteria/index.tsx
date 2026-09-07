import { createFileRoute } from "@tanstack/react-router";

import { DisabledModulePage } from "#/components/pages/disabled-module";

export const Route = createFileRoute("/(app)/$branchId/(hmis)/cafeteria/")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Cafeteria (Shaun)" }],
	}),
});

function RouteComponent() {
	return <DisabledModulePage />;
}
