import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/(tenant)")({
  beforeLoad: async ({ location }) => {
    const data = await orpc.auth.getSession();
    if (!data) {
      throw redirect({
        search: { redirect: location.href },
        to: "/",
      });
    }

    const organizationData = await orpc.organizations
      .bySubdomain()
      .catch(() => ({ organization: null }));

    return {
      ...data,
      organization: organizationData.organization
        ? {
            logo: organizationData.organization.logo,
            name: organizationData.organization.name,
          }
        : null,
    };
  },
  component: AppLayout,
});

function AppLayout() {
  return <Outlet />;
}
