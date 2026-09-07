import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import Sidebar from "#/components/sidebar";
import { getSession as getClientSession } from "#/lib/auth/client";
import { getSession } from "#/rpc/server-actions/auth";

export const Route = createFileRoute("/(app)")({
	beforeLoad: async (ctx) => {
		const auth =
			typeof window === "undefined"
				? await getSession()
				: (await getClientSession())?.data;
		if (!auth?.user) {
			throw redirect({
				search: { redirect: ctx.location.href },
				to: "/",
			});
		}
		const { session, user } = auth;

		const companyId = "123D";

		return { companyId, session, user };
	},
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Shaun" }],
	}),
});

function RouteComponent() {
	return (
		<div className="flex h-screen">
			<Sidebar />
			<main className="flex-1 overflow-y-auto p-6 pt-12 lg:pt-6">
				<Outlet />
			</main>
		</div>
	);
}
