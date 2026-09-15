import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, UserPlus, UsersRound } from "lucide-react";

import { PageHeader } from "#/components/page-header";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/settings/users/")({
	component: UsersPage,
	loader: async () => {
		try {
			return await orpc.users.list();
		} catch (error) {
			console.error("Failed to load users", error);
			return null;
		}
	},
});

const roleLabels: Record<string, string> = {
	admin: "Administrator",
	member: "Member",
	owner: "Owner",
};

function UsersPage() {
	const users = Route.useLoaderData();
	const count = users?.length ?? 0;

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					actions={
						<div className="flex items-center gap-2">
							<Badge
								className="hidden items-center gap-2 rounded-full border-border bg-card px-3 py-1.5 text-xs text-muted-foreground sm:inline-flex"
								variant="outline"
							>
								<UsersRound className="size-4" />
								{count} {count === 1 ? "user" : "users"}
							</Badge>
							<Button
								nativeButton={false}
								render={<Link to="/settings/users/new" />}
							>
								<Plus />
								Add user
							</Button>
						</div>
					}
					description="Manage the people who can access this workspace."
					title="Users"
				/>

				<Card>
					<CardHeader className="border-b">
						<div className="flex items-center justify-between gap-3">
							<div>
								<CardTitle>Workspace users</CardTitle>
								<p className="mt-1 text-xs text-muted-foreground">
									Roles and access are provisioned through Aspen.
								</p>
							</div>
							<UserPlus className="size-5 text-muted-foreground" />
						</div>
					</CardHeader>
					<CardContent className="p-0">
						{users === null ? (
							<EmptyState
								description="We could not load users from Aspen. Try refreshing the page."
								title="Users are unavailable"
							/>
						) : users.length === 0 ? (
							<EmptyState
								description="Users will appear here when they are provisioned for this workspace."
								title="No users yet"
							/>
						) : (
							<Table className="min-w-[680px]">
								<TableHeader className="bg-input/30">
									<TableRow className="hover:bg-transparent">
										<TableHead className="px-5 text-xs text-muted-foreground">
											User
										</TableHead>
										<TableHead className="px-5 text-xs text-muted-foreground">
											Role
										</TableHead>
										<TableHead className="px-5 text-xs text-muted-foreground">
											Added
										</TableHead>
										<TableHead className="px-5 text-right text-xs text-muted-foreground" />
									</TableRow>
								</TableHeader>
								<TableBody className="divide-y divide-border">
									{users.map((user) => (
										<TableRow className="hover:bg-input/20" key={user.id}>
											<TableCell className="px-5 py-4">
												<div className="flex items-center gap-3">
													<UserAvatar name={user.name ?? user.email ?? "?"} />
													<div className="min-w-0">
														<p className="truncate font-medium ">
															{user.name ?? "Unnamed user"}
														</p>
														<p className="truncate text-xs text-muted-foreground">
															{user.email ?? "No email"}
														</p>
													</div>
												</div>
											</TableCell>
											<TableCell className="px-5 py-4">
												<Badge className="bg-primary/10 text-primary">
													{roleLabels[user.role ?? ""] ??
														user.role ??
														"Unassigned"}
												</Badge>
											</TableCell>
											<TableCell className="px-5 py-4 text-xs text-muted-foreground">
												{formatDate(user.createdAt)}
											</TableCell>
											<TableCell className="px-5 py-4 text-right">
												<Link
													className="text-xs font-medium text-primary hover:underline"
													params={{ id: user.id }}
													to="/settings/users/$id"
												>
													View
												</Link>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
			</div>
		</main>
	);
}

function EmptyState({
	description,
	title,
}: {
	description: string;
	title: string;
}) {
	return (
		<div className="px-6 py-16 text-center">
			<p className="text-sm font-medium ">{title}</p>
			<p className="mx-auto mt-2 max-w-sm text-xs text-muted-foreground">
				{description}
			</p>
		</div>
	);
}

function UserAvatar({ name }: { name: string }) {
	const initials = name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");

	return (
		<Avatar className="size-9 bg-input/40">
			<AvatarFallback className="bg-input/40 text-xs font-medium text-muted-foreground">
				{initials || "?"}
			</AvatarFallback>
		</Avatar>
	);
}

function formatDate(value: Date | string | null | undefined) {
	if (!value) {
		return "—";
	}
	return new Intl.DateTimeFormat(undefined, {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(value));
}
