import { IconExclamationCircle, IconHome } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";

export function ErrorPage() {
	return (
		<div className="flex min-h-[50vh] items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
						<IconExclamationCircle className="size-8 text-destructive" />
					</div>
					<CardTitle>Something went wrong</CardTitle>
				</CardHeader>
				<CardContent className="text-center">
					<p className="mb-6 text-muted-foreground">
						An unexpected error occurred. Please try again.
					</p>
					<Button>
						<Link to="/">
							<IconHome data-icon="inline-start" />
							Go Home
						</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
