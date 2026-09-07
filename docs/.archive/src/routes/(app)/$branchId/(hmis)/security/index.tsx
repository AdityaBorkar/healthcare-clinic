import { createFileRoute } from "@tanstack/react-router";

import { DisabledModulePage } from "#/components/pages/disabled-module";

export const Route = createFileRoute("/(app)/$branchId/(hmis)/security/")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Security (Shaun)" }],
	}),
});

function RouteComponent() {
	return <DisabledModulePage />;
}
