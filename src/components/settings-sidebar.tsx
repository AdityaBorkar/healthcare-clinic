import { Link, useLocation } from "@tanstack/react-router";
import {
	ArrowLeft,
	BookOpen,
	ClipboardList,
	FileBarChart,
	History,
	LogOut,
	type LucideIcon,
	Settings2,
	Shield,
	SlidersHorizontal,
	Ticket,
	Users,
} from "lucide-react";
import { LayoutGroup } from "motion/react";

import { SidebarHoverItem } from "#/components/sidebar-hover-item";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { WorkspaceSelector } from "#/components/workspace-selector";

type Organization = {
	logo: string | null;
	name: string;
};

type User = {
	name: string;
};

const sections = [
	{
		items: [
			{ href: "/settings/general", icon: Settings2, label: "General" },
			{
				href: "/settings/preferences",
				icon: SlidersHorizontal,
				label: "Preferences",
			},
			{ href: "/settings/branches", icon: Settings2, label: "Branches" },
		],
		label: "Organization",
	},
	{
		items: [
			{ href: "/settings/users", icon: Users, label: "Users" },
			{ href: "/settings/roles", icon: Shield, label: "Roles" },
		],
		label: "Human Resources",
	},
	{
		items: [
			{
				href: "/settings/access-history",
				icon: History,
				label: "Access History",
			},
			{ href: "/settings/audit-log", icon: ClipboardList, label: "Audit Log" },
			{ href: "/settings/reports", icon: FileBarChart, label: "Reports" },
		],
		label: "Audit",
	},
	{
		items: [
			{ href: "/settings/tickets", icon: Ticket, label: "Tickets" },
			{
				href: "/settings/knowledge-base",
				icon: BookOpen,
				label: "Knowledge Base",
			},
		],
		label: "Support",
	},
] as const;

export function SettingsSidebar({
	onSignOut,
	organization,
	user,
}: {
	onSignOut: () => void | Promise<void>;
	organization: Organization | null;
	user: User;
}) {
	return (
		<aside className="flex w-full shrink-0 flex-col border-b border-stone-border bg-white md:sticky md:top-0 md:h-svh md:w-72 md:border-r md:border-b-0 xl:w-80">
			<div className="border-b border-stone-border px-3 py-3">
				<WorkspaceSelector organization={organization} />
			</div>

			<div className="border-b border-stone-border px-3 py-3">
				<Button
					className="h-9 w-full justify-start gap-2.5 rounded-lg px-3 text-[13.5px] font-normal"
					nativeButton={false}
					render={<Link to="/dashboard" />}
					size="default"
					variant="ghost"
				>
					<ArrowLeft className="size-4 shrink-0" />
					<span className="min-w-0 flex-1 truncate text-left">
						Back to workspace
					</span>
				</Button>
			</div>

			<nav
				aria-label="Settings navigation"
				className="min-h-0 flex-1 overflow-y-auto px-3 py-4"
			>
				<LayoutGroup>
					{sections.map((section) => (
						<SidebarSection key={section.label} label={section.label}>
							{section.items.map((item) => (
								<SettingsSidebarItem
									href={item.href}
									icon={item.icon}
									key={item.href}
									label={item.label}
								/>
							))}
						</SidebarSection>
					))}
				</LayoutGroup>
			</nav>

			<div className="border-t border-stone-border px-3 py-3">
				<div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
					<Avatar className="size-9 shrink-0 bg-stone-muted/40">
						<AvatarFallback className="bg-stone-muted/40 text-xs font-medium text-warm-gray uppercase">
							{user.name.slice(0, 1)}
						</AvatarFallback>
					</Avatar>
					<span className="min-w-0 flex-1">
						<span className="block truncate text-sm font-medium text-ink-black">
							{user.name}
						</span>
						<span className="block truncate text-xs text-warm-gray">
							Signed in
						</span>
					</span>
					<Button
						aria-label="Sign out"
						onClick={onSignOut}
						size="icon-sm"
						title="Sign out"
						variant="ghost"
					>
						<LogOut className="size-4" />
					</Button>
				</div>
			</div>
		</aside>
	);
}

function SidebarSection({
	children,
	label,
}: {
	children: React.ReactNode;
	label: string;
}) {
	return (
		<section className="mb-6 last:mb-0">
			<h2 className="mb-1.5 px-3 text-[11px] font-semibold tracking-[0.08em] text-warm-gray uppercase">
				{label}
			</h2>
			<div className="space-y-0.5">{children}</div>
		</section>
	);
}

function SettingsSidebarItem({
	href,
	icon: Icon,
	label,
}: {
	href: string;
	icon: LucideIcon;
	label: string;
}) {
	const location = useLocation();
	const active = location.pathname === href;

	return (
		<SidebarHoverItem>
			<Button
				aria-current={active ? "page" : undefined}
				className={`h-9 w-full justify-start gap-2.5 rounded-lg bg-transparent px-3 text-left text-[13.5px] hover:bg-transparent ${active ? "bg-cyan-signal/10 font-medium text-ink-black hover:bg-cyan-signal/10" : "font-normal text-warm-gray hover:text-soot"}`}
				nativeButton={false}
				render={<Link aria-current={active ? "page" : undefined} to={href} />}
				size="default"
				variant="ghost"
			>
				<Icon className={`size-4 shrink-0 ${active ? "text-cyan-edge" : ""}`} />
				<span className="min-w-0 flex-1 truncate">{label}</span>
			</Button>
		</SidebarHoverItem>
	);
}
