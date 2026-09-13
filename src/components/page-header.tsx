import type { ReactNode } from "react";

type PageHeaderProps = {
	title: string;
	description?: string;
	actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
	return (
		<div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
			<div className="min-w-0 flex-1">
				<h1 className="truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
					{title}
				</h1>
				{description ? (
					<p className="mt-1 max-w-2xl text-sm text-muted-foreground">
						{description}
					</p>
				) : null}
			</div>
			{actions ? (
				<div className="flex shrink-0 items-center gap-2">{actions}</div>
			) : null}
		</div>
	);
}
