import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/account")({
	beforeLoad: async ({ location }) => {
		const data = await orpc.auth.session.get();
		if (!data) {
			throw redirect({
				search: { redirect: location.href },
				to: "/",
			});
		}
		return data;
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="min-h-svh bg-background">
			<Outlet />
		</main>
	);
}
