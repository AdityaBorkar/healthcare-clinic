import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Building2, Pencil } from "lucide-react";
import { type ReactNode, useCallback, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { orpc } from "#/lib/rpc";
import {
	OrganizationForm,
	type OrganizationFormValues,
} from "./-organization-form";

export const Route = createFileRoute("/(tenant)/settings/general")({
	component: GeneralPage,
	loader: async () => {
		try {
			return await orpc.organizations.current();
		} catch (error) {
			console.error("Failed to load organization", error);
			return null;
		}
	},
});

function GeneralPage() {
	const organization = Route.useLoaderData();
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);

	const handleEdit = useCallback(() => setIsEditing(true), []);
	const handleCancelEdit = useCallback(() => setIsEditing(false), []);

	const handleSubmit = useCallback(
		async (values: OrganizationFormValues) => {
			await orpc.organizations.update({
				logo: values.logo || null,
				name: values.name,
				slug: values.slug,
			});
			await router.invalidate();
			setIsEditing(false);
		},
		[router],
	);

	if (organization === null) {
		return (
			<main className="bg-stone-canvas px-4 py-6 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-4xl space-y-6">
					<PageHeader
						description="Organization profile and workspace details."
						title="General"
					/>
					<Card>
						<CardContent className="py-16 text-center">
							<span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-stone-muted/40">
								<Building2 className="size-6 text-warm-gray" />
							</span>
							<p className="text-sm font-medium ">
								Organization information is unavailable
							</p>
							<p className="mx-auto mt-2 max-w-sm text-xs text-warm-gray">
								We could not load your organization's profile. Try refreshing
								the page.
							</p>
						</CardContent>
					</Card>
				</div>
			</main>
		);
	}

	if (isEditing) {
		return (
			<main className="bg-stone-canvas px-4 py-6 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-3xl space-y-6">
					<PageHeader
						description="Update your organization's information."
						title="Edit organization"
					/>
					<Card>
						<CardContent className="p-6">
							<OrganizationForm
								initialValues={toFormValues(organization)}
								onCancel={handleCancelEdit}
								onSubmit={handleSubmit}
							/>
						</CardContent>
					</Card>
				</div>
			</main>
		);
	}

	return (
		<main className="bg-stone-canvas px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl space-y-6">
				<PageHeader
					actions={
						<Button onClick={handleEdit} variant="outline">
							<Pencil />
							Edit organization
						</Button>
					}
					description="Organization profile and workspace details."
					title="General"
				/>

				<Card>
					<CardHeader className="border-b">
						<CardTitle>Organization profile</CardTitle>
						<CardDescription>
							Public information about this organization.
						</CardDescription>
					</CardHeader>
					<CardContent className="p-6">
						<dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
							<Detail label="Name" value={organization.name} />
							<Detail label="Slug" value={organization.slug} />
							<Detail label="Logo" value={organization.logo} />
						</dl>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="border-b">
						<CardTitle>Workspace</CardTitle>
						<CardDescription>
							System information about this workspace.
						</CardDescription>
					</CardHeader>
					<CardContent className="p-6">
						<dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
							<div>
								<dt className="text-xs font-medium text-warm-gray">Status</dt>
								<dd className="mt-1.5">
									<StatusBadge status={organization.status} />
								</dd>
							</div>
							<Detail
								label="Created"
								value={formatDateTime(organization.createdAt)}
							/>
							<Detail label="Plan" value={organization.plan} />
							<Detail
								label="Organization ID"
								value={
									<code className="font-mono text-xs break-all">
										{organization.id}
									</code>
								}
							/>
						</dl>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}

function toFormValues(
	organization: NonNullable<ReturnType<typeof Route.useLoaderData>>,
): OrganizationFormValues {
	return {
		logo: organization.logo ?? "",
		name: organization.name,
		slug: organization.slug,
	};
}

// biome-ignore lint/style/useComponentExportOnlyModules: route modules export a Route config alongside render helpers
function Detail({ label, value }: { label: string; value: ReactNode }) {
	return (
		<div>
			<dt className="text-xs font-medium text-warm-gray">{label}</dt>
			<dd className="mt-1 text-sm break-words ">{value ?? "—"}</dd>
		</div>
	);
}

// biome-ignore lint/style/useComponentExportOnlyModules: route modules export a Route config alongside render helpers
function StatusBadge({ status }: { status: string | null }) {
	const variant =
		status === "active"
			? "outline"
			: status === "suspended"
				? "destructive"
				: "secondary";

	return (
		<Badge className="gap-1.5 px-2 py-0.5 text-[11px]" variant={variant}>
			<span className="size-1.5 rounded-full bg-current opacity-70" />
			{status ?? "unknown"}
		</Badge>
	);
}

function formatDateTime(value: string | null | undefined) {
	if (!value) {
		return null;
	}
	return new Intl.DateTimeFormat(undefined, {
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		month: "short",
		year: "numeric",
	}).format(new Date(value));
}
