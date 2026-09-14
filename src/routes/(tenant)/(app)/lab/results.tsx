import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/lab/results")({
	component: RouteComponent,
});

type TatRow = {
	authorizedAt: string | null;
	orderId: string;
	orderNo: string;
	orderedAt: string;
	patientId: string;
	priority: string;
	status: string;
	tatHrs: number | null;
	tests: number;
};

function RouteComponent() {
	const [entry, setEntry] = useState({
		by: "",
		flag: "normal",
		orderId: "",
		testCode: "",
		value: "",
	});
	const [ack, setAck] = useState({
		by: "",
		note: "",
		orderId: "",
		testCode: "",
	});
	const [auth, setAuth] = useState({
		by: "",
		orderId: "",
		preview: "",
		role: "pathologist",
		signed: false,
	});
	const [deliver, setDeliver] = useState({ channel: "print", orderId: "" });
	const [tat, setTat] = useState<{
		avgTatHrs: number | null;
		reported: number;
		rows: Array<TatRow>;
	} | null>(null);
	const [result, setResult] = useState<string | null>(null);

	function fail(error: unknown) {
		setResult(error instanceof Error ? error.message : "Operation failed");
	}

	async function enterResult() {
		try {
			await orpc.diagnostics.results.enter({
				branchId: "main",
				enteredBy: entry.by,
				flag: entry.flag as "normal" | "L" | "H" | "critical",
				orderId: entry.orderId,
				testCode: entry.testCode,
				value: entry.value,
			});
			setResult(`Result entered for ${entry.testCode} (flag ${entry.flag}).`);
		} catch (error) {
			fail(error);
		}
	}

	async function ackCritical() {
		try {
			await orpc.diagnostics.results.acknowledgeCritical({
				ackBy: ack.by,
				branchId: "main",
				note: ack.note || undefined,
				orderId: ack.orderId,
				testCode: ack.testCode,
			});
			setResult("Critical value acknowledged by doctor.");
		} catch (error) {
			fail(error);
		}
	}

	async function preview() {
		try {
			const order = (await orpc.diagnostics.orders.get({
				branchId: "main",
				id: auth.orderId,
			})) as { status?: string };
			setAuth((current) => ({
				...current,
				preview: JSON.stringify(order).slice(0, 800),
				signed: order.status === "authorized",
			}));
		} catch (error) {
			fail(error);
		}
	}

	async function authorize() {
		try {
			await orpc.diagnostics.results.authorize({
				authorizedBy: auth.by,
				branchId: "main",
				orderId: auth.orderId,
				role: auth.role,
			});
			setResult("Report authorized and signed.");
			setAuth((current) => ({ ...current, signed: true }));
		} catch (error) {
			fail(error);
		}
	}

	async function deliverReport() {
		try {
			await orpc.diagnostics.results.deliver({
				branchId: "main",
				channel: deliver.channel as "print" | "whatsapp" | "email" | "portal",
				orderId: deliver.orderId,
			});
			if (deliver.channel === "print") {
				window.print();
			}
			setResult(`Report delivered via ${deliver.channel} (logged).`);
		} catch (error) {
			fail(error);
		}
	}

	const loadTat = useCallback(async () => {
		try {
			const report = (await orpc.diagnostics.reports.tat({
				branchId: "main",
				limit: 100,
			})) as {
				avgTatHrs: number | null;
				reported: number;
				rows: Array<TatRow>;
			};
			setTat(report);
		} catch {
			setTat(null);
		}
	}, []);

	useEffect(() => {
		void loadTat();
	}, [loadTat]);

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="Grid entry → critical ack → authorize → deliver."
					title="Lab results"
				/>
				{result ? (
					<p className="text-sm text-muted-foreground">{result}</p>
				) : null}
				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Result entry grid
							</CardTitle>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1">
									<Label>Order ID</Label>
									<Input
										onChange={(e) =>
											setEntry({ ...entry, orderId: e.target.value })
										}
										value={entry.orderId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Test code</Label>
									<Input
										onChange={(e) =>
											setEntry({ ...entry, testCode: e.target.value })
										}
										value={entry.testCode}
									/>
								</div>
								<div className="space-y-1">
									<Label>Value</Label>
									<Input
										onChange={(e) =>
											setEntry({ ...entry, value: e.target.value })
										}
										value={entry.value}
									/>
								</div>
								<div className="space-y-1">
									<Label>Flag</Label>
									<Input
										onChange={(e) =>
											setEntry({ ...entry, flag: e.target.value })
										}
										placeholder="normal / L / H / critical"
										value={entry.flag}
									/>
								</div>
								<div className="space-y-1">
									<Label>Entered by</Label>
									<Input
										onChange={(e) => setEntry({ ...entry, by: e.target.value })}
										value={entry.by}
									/>
								</div>
							</div>
							<Button onClick={() => void enterResult()}>Enter result</Button>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Critical-ack inbox
							</CardTitle>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1">
									<Label>Order ID</Label>
									<Input
										onChange={(e) =>
											setAck({ ...ack, orderId: e.target.value })
										}
										value={ack.orderId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Test code</Label>
									<Input
										onChange={(e) =>
											setAck({ ...ack, testCode: e.target.value })
										}
										value={ack.testCode}
									/>
								</div>
								<div className="space-y-1">
									<Label>Ack by (doctor)</Label>
									<Input
										onChange={(e) => setAck({ ...ack, by: e.target.value })}
										value={ack.by}
									/>
								</div>
								<div className="space-y-1">
									<Label>Note</Label>
									<Input
										onChange={(e) => setAck({ ...ack, note: e.target.value })}
										value={ack.note}
									/>
								</div>
							</div>
							<Button onClick={() => void ackCritical()} variant="outline">
								Acknowledge critical
							</Button>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Authorize inbox
							</CardTitle>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1">
									<Label>Order ID</Label>
									<Input
										onChange={(e) =>
											setAuth({ ...auth, orderId: e.target.value })
										}
										value={auth.orderId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Authorizer role</Label>
									<Input
										onChange={(e) => setAuth({ ...auth, role: e.target.value })}
										value={auth.role}
									/>
								</div>
								<div className="space-y-1">
									<Label>Authorized by</Label>
									<Input
										onChange={(e) => setAuth({ ...auth, by: e.target.value })}
										value={auth.by}
									/>
								</div>
							</div>
							<div className="flex flex-wrap gap-2">
								<Button onClick={() => void preview()} variant="outline">
									Preview
								</Button>
								<Button onClick={() => void authorize()}>
									Sign + authorize
								</Button>
							</div>
							{auth.preview ? (
								<div className="relative rounded-md border p-3 text-xs">
									{auth.signed ? null : (
										<span className="absolute inset-0 flex items-center justify-center bg-white/70 font-bold text-2xl text-red-600">
											DRAFT — unsigned
										</span>
									)}
									<pre className="whitespace-pre-wrap">{auth.preview}</pre>
								</div>
							) : null}
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Deliver log
							</CardTitle>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1">
									<Label>Order ID</Label>
									<Input
										onChange={(e) =>
											setDeliver({ ...deliver, orderId: e.target.value })
										}
										value={deliver.orderId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Channel</Label>
									<Input
										onChange={(e) =>
											setDeliver({ ...deliver, channel: e.target.value })
										}
										placeholder="print / whatsapp / email / portal"
										value={deliver.channel}
									/>
								</div>
							</div>
							<Button onClick={() => void deliverReport()} variant="outline">
								Deliver report
							</Button>
						</CardContent>
					</Card>
				</div>
				<Card className="shadow-xs">
					<CardContent className="py-6">
						<CardTitle className="mb-3 text-base font-semibold">
							TAT report{" "}
							{tat
								? `(avg ${tat.avgTatHrs ?? "—"}h · ${tat.reported} reported)`
								: ""}
						</CardTitle>
						<ul className="max-h-64 divide-y overflow-auto text-sm">
							{(tat?.rows ?? []).map((row) => (
								<li
									className="flex justify-between gap-2 py-2"
									key={row.orderId}
								>
									<span>
										{row.orderNo} · {row.priority} · {row.status}
									</span>
									<span className="text-muted-foreground">
										{row.tatHrs === null ? "pending" : `${row.tatHrs}h`}
									</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
