import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

import { pm } from "#/aspen/client";
import { NotPrintable } from "#/components/not-printable";
import { TenantSidebar } from "#/components/tenant-sidebar";
import { Route as BaseRoute } from "../route";

export const Route = createFileRoute("/(tenant)/(app)")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { organization, user } = BaseRoute.useRouteContext();

	const handleSignOut = useCallback(async () => {
		await pm.auth.client.signOut();
		navigate({ to: "/" });
	}, [navigate]);

	return (
		<NotPrintable>
			<div className="flex min-h-svh flex-col bg-background md:flex-row">
				<TenantSidebar
					onSignOut={handleSignOut}
					organization={organization}
					user={user}
				/>

				<div className="min-w-0 flex-1">
					<Outlet />
				</div>
			</div>
		</NotPrintable>
	);
}
