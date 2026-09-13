import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Plus } from "lucide-react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";

export const Route = createFileRoute("/(tenant)/(app)/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					actions={
						<Button>
							<Plus />
							New document
						</Button>
					}
					description="Overview of your workspace activity."
					title="Dashboard"
				/>

				<Card className="shadow-xs">
					<CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
						<span className="mb-1 flex size-12 items-center justify-center rounded-xl bg-primary/10">
							<LayoutDashboard className="size-6 text-primary" />
						</span>
						<CardTitle className="text-base font-semibold">
							Dashboard coming soon
						</CardTitle>
						<p className="max-w-sm text-sm text-muted-foreground">
							Workspace activity, recent documents, and pending approvals will
							appear here.
						</p>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
