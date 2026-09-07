import { IconHome, IconLockExclamation } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";

export function DisabledModulePage() {
	return (
		<div className="flex h-screen items-center justify-center">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
						<IconLockExclamation className="size-8 text-destructive" />
					</div>
					<CardTitle>Module Disabled</CardTitle>
				</CardHeader>
				<CardContent className="text-center">
					<p className="mb-6 text-muted-foreground">
						Please contact Admin to enable this module.
					</p>
					<Button>
						<Link to="/dashboard">
							<IconHome className="-mt-0.5 mr-1 inline-block" />
							Return to Dashboard
						</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
