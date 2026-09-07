import { cn } from "#/lib/utils";

interface ErrorAlertProps {
	centered?: boolean;
	className?: string;
	message: string;
}

export function ErrorAlert({ message, className, centered }: ErrorAlertProps) {
	return (
		<div
			className={cn(
				"rounded-lg bg-destructive/10 px-3 py-2 text-destructive text-sm",
				centered && "text-center",
				className,
			)}
		>
			{message}
		</div>
	);
}
