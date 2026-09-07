import { IconLoader2 } from "@tabler/icons-react";

export function LoadingPage() {
	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
			<IconLoader2 className="size-8 animate-spin text-primary" />
			<p className="text-muted-foreground">Loading...</p>
		</div>
	);
}
