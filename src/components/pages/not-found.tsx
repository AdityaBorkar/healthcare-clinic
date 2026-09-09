import { Link } from "@tanstack/react-router";
import { FileQuestion } from "lucide-react";
import { useCallback } from "react";

import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";

export function NotFoundPage() {
	const goBack = useCallback(() => window.history.back(), []);

	return (
		<div className="flex min-h-[60vh] items-center justify-center px-4">
			<Card className="w-full max-w-md text-center shadow-subtle">
				<CardHeader className="items-center pt-10 pb-2 text-center">
					<span className="mb-3 flex size-12 items-center justify-center rounded-full bg-sky-wash/40">
						<FileQuestion className="size-6 text-cyan-edge" />
					</span>
					<p className="font-roobert text-sm font-medium tracking-wide text-warm-gray">
						404 — Not found
					</p>
					<CardTitle className="text-lg">Page not found</CardTitle>
					<CardDescription className="max-w-sm text-sm">
						The page you are looking for doesn&apos;t exist or has been moved.
						Check the URL or return to a known location.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex justify-center gap-2 pb-10">
					<Button nativeButton={false} render={<Link to="/" />}>
						Go home
					</Button>
					<Button onClick={goBack} type="button" variant="outline">
						Go back
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
