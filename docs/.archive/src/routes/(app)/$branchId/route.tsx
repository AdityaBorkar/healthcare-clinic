import { createFileRoute, Outlet } from "@tanstack/react-router";

import { client } from "#/lib/rpc";

export const Route = createFileRoute("/(app)/$branchId")({
	beforeLoad: async ({ params }) => {
		const branchId = params.branchId;
		const branchIdNum = Number(branchId);
		if (typeof window !== "undefined") {
			localStorage.setItem("branchId", branchId);
		}
		await client.branches.validate({ branchId: branchIdNum }).catch((e) => {
			const message =
				e instanceof Error ? e.message : "Branch validation failed";
			throw new Error(message);
		});
	},
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Shaun" }],
	}),
});

function RouteComponent() {
	return <Outlet />;
}
