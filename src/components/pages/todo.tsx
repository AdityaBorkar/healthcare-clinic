import { Construction } from "lucide-react";

import { PageHeader } from "#/components/page-header";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";

export function TodoPage({
	title,
	tabs,
}: {
	title: string;
	tabs?: readonly string[];
}) {
	return (
		<main className="bg-stone-canvas px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader title={title} />
				{tabs && tabs.length > 0 ? (
					<Tabs
						className="w-fit border-b border-stone-border"
						defaultValue={tabs[0]}
					>
						<TabsList variant="line">
							{tabs.map((tab) => (
								<TabsTrigger key={tab} value={tab}>
									{tab}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				) : null}
				<Card className="shadow-[var(--shadow-subtle)]">
					<CardHeader className="flex flex-col items-center justify-center gap-4 py-16 text-center">
						<span className="mb-1 flex size-12 items-center justify-center rounded-xl bg-sky-wash/40">
							<Construction className="size-6 text-cyan-edge" />
						</span>
						<CardTitle className="text-base font-semibold">
							Coming Soon
						</CardTitle>
						<CardDescription className="max-w-sm text-sm">
							<span className="font-medium text-ink-black">{title}</span> is not
							available yet. We are actively building this module — check back
							soon.
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
		</main>
	);
}
