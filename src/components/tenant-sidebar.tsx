import { Link, useLocation } from "@tanstack/react-router";
import {
	Bell,
	ContactRound,
	Files,
	LayoutList,
	ListChecks,
	LogOut,
	type LucideIcon,
	MessageSquare,
	Pin,
	Plus,
	Search,
	Tags,
	Trash2,
	Workflow,
} from "lucide-react";
import { LayoutGroup } from "motion/react";

import { SidebarHoverItem } from "#/components/sidebar-hover-item";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { WorkspaceSelector } from "#/components/workspace-selector";
import { cn } from "#/lib/utils";

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
			{ href: "/notifications", icon: Bell, label: "Notifications" },
			{ href: "/tasks", icon: ListChecks, label: "Tasks" },
			{ href: "/workflows", icon: Workflow, label: "Workflows" },
		],
		label: "Workspace",
	},
	{
		items: [
			{ href: "/documents", icon: Files, label: "All Documents" },
			{
				href: "/document-classes",
				icon: Tags,
				label: "Document Classes",
			},
			{ href: "/document-views", icon: LayoutList, label: "Document Views" },
		],
		label: "Library",
	},
	{
		items: [
			{ href: "/discussions", icon: MessageSquare, label: "Discussions" },
			{ href: "/contacts", icon: ContactRound, label: "Contacts" },
		],
		label: "Collaborate",
	},
	{
		items: [{ href: "/recycle-bin", icon: Trash2, label: "Recycle Bin" }],
		label: "System",
	},
] as const;

type Href = (typeof sections)[number]["items"][number]["href"];

const pinnedDocumentClasses = ["Contracts", "Invoices", "Policies"];
const pinnedDocumentViews = [
	"Recently Updated",
	"My Documents",
	"Shared with Me",
];

export function TenantSidebar({
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

			<div className="space-y-2 border-b border-stone-border px-3 py-3">
				<Button
					className="h-9 w-full justify-start gap-2.5 px-3 text-sm font-normal text-warm-gray"
					variant="outline"
				>
					<Search className="size-4 shrink-0" />
					<span className="flex-1 text-left">Search</span>
					<kbd className="rounded border border-stone-border bg-stone-canvas px-1.5 py-0.5 font-sans text-[10px] font-medium text-warm-gray">
						Ctrl K
					</kbd>
				</Button>
				<Button className="h-9 w-full justify-center gap-2">
					<Plus className="size-4 shrink-0" />
					New
				</Button>
			</div>

			<nav
				aria-label="Main navigation"
				className="min-h-0 flex-1 overflow-y-auto px-3 py-4"
			>
				<LayoutGroup>
					{sections.map((section) => (
						<SidebarSection key={section.label} label={section.label}>
							{section.items.map((item) => (
								<SidebarItem
									href={item.href}
									icon={item.icon}
									key={item.href}
									label={item.label}
								/>
							))}
							{section.label === "Library" ? (
								<>
									<div className="mt-0.5 space-y-0.5 border-l border-stone-border py-0.5 pl-2">
										{pinnedDocumentClasses.map((documentClass) => (
											<SidebarItem
												href="/document-classes"
												icon={Pin}
												key={documentClass}
												label={documentClass}
												nested
											/>
										))}
									</div>
									<div className="mt-0.5 space-y-0.5 border-l border-stone-border py-0.5 pl-2">
										{pinnedDocumentViews.map((documentView) => (
											<SidebarItem
												href="/document-views"
												icon={Pin}
												key={documentView}
												label={documentView}
												nested
											/>
										))}
									</div>
								</>
							) : null}
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

function SidebarItem({
	href,
	icon: Icon,
	label,
	nested = false,
}: {
	href: Href;
	icon: LucideIcon;
	label: string;
	nested?: boolean;
}) {
	const location = useLocation();
	const active = nested
		? false
		: location.pathname === href ||
			(location.pathname.startsWith(`${href}/`) && href !== "/documents");

	const content = (
		<>
			<Icon
				className={cn(
					"size-4 shrink-0",
					active ? "text-cyan-edge" : "text-warm-gray",
				)}
			/>
			<span className="min-w-0 flex-1 truncate">{label}</span>
		</>
	);

	return (
		<SidebarHoverItem>
			<Button
				aria-current={active ? "page" : undefined}
				className={cn(
					"h-9 w-full justify-start gap-2.5 rounded-lg bg-transparent px-3 text-[13.5px] hover:bg-transparent",
					nested ? "h-8 pl-3 text-[13px]" : null,
					active
						? "bg-cyan-signal/10 font-medium text-ink-black hover:bg-cyan-signal/10"
						: "font-normal text-warm-gray hover:text-soot",
				)}
				nativeButton={false}
				render={<Link aria-current={active ? "page" : undefined} to={href} />}
				size="default"
				variant="ghost"
			>
				{content}
			</Button>
		</SidebarHoverItem>
	);
}
