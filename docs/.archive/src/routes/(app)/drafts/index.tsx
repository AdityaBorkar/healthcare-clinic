import { IconDeviceFloppy, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import type { FormType } from "#/lib/actions/forms";
import { FORM_TYPES } from "#/lib/actions/forms";
import { client } from "#/lib/rpc";

export const Route = createFileRoute("/(app)/drafts/")({
	component: DraftsPage,
	head: () => ({
		meta: [{ title: "Drafts (Shaun)" }],
	}),
});

function formatRelativeTime(date: Date): string {
	const now = Date.now();
	const diff = now - date.getTime();
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) {
		return `${days} day${days > 1 ? "s" : ""} ago`;
	}
	if (hours > 0) {
		return `${hours} hour${hours > 1 ? "s" : ""} ago`;
	}
	if (minutes > 0) {
		return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
	}
	return "Just now";
}

function DraftsPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: drafts, isLoading } = useQuery({
		queryFn: async () => await client.drafts.list({}),
		queryKey: ["drafts"],
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => client.drafts.delete({ id }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["drafts"] });
		},
	});

	const handleContinue = (draft: { formType: string; id: number }) => {
		const formType = FORM_TYPES[draft.formType as FormType];
		if (!formType) return;
		navigate({
			search: { draftId: draft.id },
			to: formType.route,
		});
	};

	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="font-bold text-2xl">Drafts</h1>
				<p className="text-muted-foreground">
					Resume incomplete forms saved as drafts
				</p>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<IconDeviceFloppy className="h-5 w-5 text-primary" />
						<CardTitle>Saved Drafts</CardTitle>
					</div>
					<CardDescription>
						{drafts?.length ?? 0} draft{drafts?.length !== 1 ? "s" : ""} saved
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="py-8 text-center text-muted-foreground">
							Loading drafts...
						</div>
					) : drafts && drafts.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Type</TableHead>
									<TableHead>Label</TableHead>
									<TableHead>Last Updated</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{drafts.map((draft) => {
									const formType = FORM_TYPES[draft.formType as FormType];
									return (
										<TableRow key={draft.id}>
											<TableCell>
												<Badge variant="secondary">
													{formType?.label ?? draft.formType}
												</Badge>
											</TableCell>
											<TableCell className="font-medium">
												{draft.label}
											</TableCell>
											<TableCell className="text-muted-foreground">
												{draft.updatedAt
													? formatRelativeTime(new Date(draft.updatedAt))
													: "Unknown"}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Button
														onClick={() => handleContinue(draft)}
														size="sm"
													>
														Continue
													</Button>
													<Button
														onClick={() => deleteMutation.mutate(draft.id)}
														size="icon-sm"
														variant="ghost"
													>
														<IconTrash className="h-4 w-4 text-destructive" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					) : (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<IconDeviceFloppy className="mb-4 h-12 w-12 text-muted-foreground/50" />
							<p className="font-medium text-muted-foreground">
								No drafts saved yet
							</p>
							<p className="text-muted-foreground text-sm">
								Use "Save as Draft" on any form to create one
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
