import { createFileRoute, Link } from "@tanstack/react-router";
import {
	BookOpen,
	ChevronRight,
	ClipboardList,
	FileBarChart,
	History,
	Settings2,
	Shield,
	SlidersHorizontal,
	Ticket,
	Users,
	UsersRound,
} from "lucide-react";

import { PageHeader } from "#/components/page-header";
import {
	Card,
	CardAction,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";

export const Route = createFileRoute("/(tenant)/settings/")({
	component: SettingsPage,
});

const sections = [
	{
		items: [
			{
				description: "Organization profile, branding, and workspace defaults.",
				href: "/settings/general",
				icon: Settings2,
				label: "General",
			},
			{
				description: "Personal preferences and default behaviors.",
				href: "/settings/preferences",
				icon: SlidersHorizontal,
				label: "Preferences",
			},
		],
		label: "Organization",
	},
	{
		items: [
			{
				description: "Manage the people who can access this workspace.",
				href: "/settings/users",
				icon: Users,
				label: "Users",
			},
			{
				description: "Create and assign permission roles.",
				href: "/settings/roles",
				icon: Shield,
				label: "Roles",
			},
			{
				description: "Model your organization's hierarchy and teams.",
				href: "/settings/branches",
				icon: UsersRound,
				label: "Organization Structure",
			},
		],
		label: "Human Resources",
	},
	{
		items: [
			{
				description: "Review who signed in and when.",
				href: "/settings/access-history",
				icon: History,
				label: "Access History",
			},
			{
				description: "Track changes made across the workspace.",
				href: "/settings/audit-log",
				icon: ClipboardList,
				label: "Audit Log",
			},
			{
				description: "Generate and export workspace reports.",
				href: "/settings/reports",
				icon: FileBarChart,
				label: "Reports",
			},
		],
		label: "Audit",
	},
	{
		items: [
			{
				description: "Manage support tickets from your users.",
				href: "/settings/tickets",
				icon: Ticket,
				label: "Tickets",
			},
			{
				description: "Author and organize help articles.",
				href: "/settings/knowledge-base",
				icon: BookOpen,
				label: "Knowledge Base",
			},
		],
		label: "Support",
	},
] as const;

type Service = (typeof sections)[number]["items"][number];

function SettingsPage() {
	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-8">
				<PageHeader
					description="Manage your workspace services and configuration."
					title="Settings"
				/>

				<div className="space-y-8">
					{sections.map((section) => (
						<section key={section.label}>
							<h2 className="mb-3 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
								{section.label}
							</h2>
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{section.items.map((item) => (
									<ServiceCard item={item} key={item.href} />
								))}
							</div>
						</section>
					))}
				</div>
			</div>
		</main>
	);
}

// biome-ignore lint/style/useComponentExportOnlyModules: route modules export a Route config alongside render helpers
function ServiceCard({ item }: { item: Service }) {
	const Icon = item.icon;

	return (
		<Link className="group/card block rounded-xl" to={item.href}>
			<Card className="h-full shadow-xs transition-shadow hover:shadow-md">
				<CardHeader>
					<span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
						<Icon className="size-5 text-primary" />
					</span>
					<CardTitle>{item.label}</CardTitle>
					<CardDescription>{item.description}</CardDescription>
					<CardAction>
						<ChevronRight className="size-4 text-muted-foreground transition-transform group-hover/card:translate-x-0.5" />
					</CardAction>
				</CardHeader>
			</Card>
		</Link>
	);
}
