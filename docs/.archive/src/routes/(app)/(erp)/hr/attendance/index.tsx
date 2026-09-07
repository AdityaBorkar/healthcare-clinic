import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/(erp)/hr/attendance/")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Attendance (Shaun)" }],
	}),
});

function RouteComponent() {
	return <div>Hello "/hr/attendance/"!</div>;
}
