import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)")({
	beforeLoad: async ({ location }) => {
		const data = await orpc.auth.session.get();
		if (!data) {
			throw redirect({
				search: { redirect: location.href },
				to: "/",
			});
		}

		const { organization } = await orpc.organizations
			.getBySubdomain()
			.catch(() => ({ organization: null }));
		if (!organization) {
			throw redirect({ to: "/account/organizations" });
		}
		const { logo, name, slug } = organization;
		return { ...data, organization: { logo, name, slug } };
	},
	component: AppLayout,
});

function AppLayout() {
	return <Outlet />;
}
