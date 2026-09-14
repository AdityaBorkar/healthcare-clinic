import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/nursing/board")({
	component: RouteComponent,
});

interface BoardTask {
	dueAt: string | null;
	id: string;
	kind: string;
	patientId: string;
	status: string;
	title: string;
}

function RouteComponent() {
	const [board, setBoard] = useState<{
		amber: BoardTask[];
		open: BoardTask[];
		overdueCount: number;
		red: BoardTask[];
	} | null>(null);

	useEffect(() => {
		orpc.nursing.board({ branchId: "main" }).then(
			(b) => setBoard(b as typeof board),
			() => setBoard(null),
		);
	}, []);

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="Red = critical open tasks. Amber = overdue. Overdue is never silent."
					title="Nursing board"
				/>
				<div className="grid gap-4 sm:grid-cols-2">
					<Card className="border-red-500 shadow-xs">
						<CardContent className="py-6">
							<CardTitle className="mb-3 text-base font-semibold text-red-600">
								Red ({board?.red.length ?? 0})
							</CardTitle>
							<ul className="divide-y text-sm">
								{(board?.red ?? []).map((t) => (
									<li className="py-2" key={t.id}>
										{t.title} · {t.patientId}
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
					<Card className="border-amber-500 shadow-xs">
						<CardContent className="py-6">
							<CardTitle className="mb-3 text-base font-semibold text-amber-600">
								Amber · overdue ({board?.overdueCount ?? 0})
							</CardTitle>
							<ul className="divide-y text-sm">
								{(board?.amber ?? []).map((t) => (
									<li className="py-2" key={t.id}>
										{t.title} · due {t.dueAt}
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				</div>
				<Card className="shadow-xs">
					<CardContent className="py-6">
						<CardTitle className="mb-3 text-base font-semibold">
							All open ({board?.open.length ?? 0})
						</CardTitle>
						<ul className="divide-y text-sm">
							{(board?.open ?? []).map((t) => (
								<li className="flex justify-between py-2" key={t.id}>
									<span>
										{t.title} · {t.patientId}
									</span>
									<span className="text-muted-foreground">{t.kind}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
