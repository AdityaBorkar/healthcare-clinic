import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";

import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { BASE_URL } from "#/env";

export const Route = createFileRoute("/not-found")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="flex min-h-svh items-center justify-center bg-stone-canvas px-4 py-12 font-sans ">
			<Card className="w-full max-w-sm p-6 text-center shadow-shadow-md">
				<span className="mx-auto mb-5 flex size-10 items-center justify-center rounded-full bg-stone-muted/40 ">
					<Building2 className="size-5" />
				</span>
				<h1 className=" text-lg font-medium  ">Organization: Not Found</h1>
				<p className="mt-2 text-sm text-warm-gray">
					This organization does not exist or is no longer active.
				</p>
				<Button
					className="mt-6 w-full"
					nativeButton={false}
					render={
						<a aria-label="Return to Global Sign-In Page" href={BASE_URL} />
					}
					size="lg"
				>
					Return to Global Sign-In Page
				</Button>
			</Card>
		</main>
	);
}
