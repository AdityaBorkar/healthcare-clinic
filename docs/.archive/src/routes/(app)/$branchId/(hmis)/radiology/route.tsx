import {
	IconCalendar,
	IconDeviceDesktop,
	IconFileText,
	IconSettings,
	type TablerIcon,
} from "@tabler/icons-react";
import {
	createFileRoute,
	Link,
	Outlet,
	useParams,
} from "@tanstack/react-router";

import { cn } from "#/lib/utils";

export const Route = createFileRoute("/(app)/$branchId/(hmis)/radiology")({
	component: RadiologyLayout,
	head: () => ({
		meta: [{ title: "Radiology (Shaun)" }],
	}),
});

function NavLink(item: { icon: TablerIcon; label: string; to: string }) {
	return (
		<Link
			activeOptions={{ exact: true }}
			activeProps={{
				className: "bg-primary/10 text-primary font-medium",
			}}
			className={cn(
				"flex items-center gap-2 rounded-lg px-3 py-1.5 text-muted-foreground text-sm transition-colors",
			)}
			to={item.to}
		>
			<item.icon className="h-4 w-4" />
			{item.label}
		</Link>
	);
}

function RadiologyLayout() {
	const { branchId } = useParams({ strict: false });
	console.log({ branchId });
	return (
		<div className="flex h-full flex-col">
			<div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="flex h-14 items-center gap-4 px-6">
					<h1 className="font-semibold text-lg">Radiology</h1>
					<nav className="flex items-center gap-1">
						<NavLink
							icon={IconDeviceDesktop}
							label="Overview"
							to={`/${branchId}/radiology`}
						/>
						<NavLink
							icon={IconSettings}
							label="Services"
							to={`/${branchId}/radiology/services`}
						/>
						<NavLink
							icon={IconCalendar}
							label="Scheduling"
							to={`/${branchId}/radiology/scheduling`}
						/>
						<NavLink
							icon={IconFileText}
							label="Reports"
							to={`/${branchId}/radiology/reports`}
						/>
					</nav>
				</div>
			</div>
			<div className="flex-1 overflow-auto">
				<Outlet />
			</div>
		</div>
	);
}
