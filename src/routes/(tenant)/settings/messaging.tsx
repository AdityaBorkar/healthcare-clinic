import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { useBranch } from "#/lib/branch-store";
import { exportRowsCsv, printPage } from "#/lib/export";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/settings/messaging")({
	component: MessagingPage,
});

const api: typeof orpc = orpc;

type Template = { body: string; id: string; kind: string; name: string };
type Rule = { daysAfter: number; id: string; message: string; name: string };

function MessagingPage() {
	const [branchId] = useBranch();
	const [templates, setTemplates] = useState<Array<Template>>([]);
	const [rules, setRules] = useState<Array<Rule>>([]);
	const [tpl, setTpl] = useState({ body: "", kind: "whatsapp", name: "" });
	const [send, setSend] = useState({
		channel: "whatsapp",
		template: "",
		to: "",
	});
	const [rule, setRule] = useState({ daysAfter: "", message: "", name: "" });
	const [log, setLog] = useState<Array<Record<string, unknown>>>([]);
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		try {
			const [t, r] = await Promise.all([
				api.admin.listTemplates(),
				api.admin.listRecallRules(),
			]);
			setTemplates(t as Array<Template>);
			setRules(r as Array<Rule>);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Messaging load failed");
		}
	}, []);

	useEffect(() => {
		void load();
	}, [load]);

	async function saveTemplate() {
		setError(null);
		try {
			await api.admin.saveTemplate({
				body: tpl.body,
				branchId,
				kind: tpl.kind,
				name: tpl.name,
			});
			setTpl({ body: "", kind: "whatsapp", name: "" });
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Template save failed");
		}
	}

	async function sendMessage() {
		setError(null);
		try {
			await api.operations.messagingSend({
				branchId,
				channel: send.channel as "sms" | "whatsapp",
				template: send.template,
				to: send.to,
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Send failed");
		}
	}

	async function saveRule() {
		setError(null);
		try {
			await api.admin.saveRecallRule({
				branchId,
				daysAfter: Number(rule.daysAfter) || 0,
				message: rule.message,
				name: rule.name,
			});
			setRule({ daysAfter: "", message: "", name: "" });
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Rule save failed");
		}
	}

	async function loadLog() {
		setError(null);
		try {
			await api.operations.explorerGrant({
				branchId,
				granteeId: "self",
				scope: "healthcare_message_log",
			});
		} catch {
			// grant may already exist
		}
		try {
			const res = (await api.operations.explorerQuery({
				branchId,
				collection: "healthcare_message_log",
				limit: 100,
				sort: "created_at:desc",
			})) as Array<Record<string, unknown>>;
			setLog(res);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Delivery log load failed");
		}
	}

	async function retry(messageId: string) {
		try {
			await api.operations.messagingRetry({ branchId, messageId });
			await loadLog();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Retry failed");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl space-y-6">
				<PageHeader
					actions={
						<>
							<Button
								onClick={() =>
									exportRowsCsv(
										"message-log.csv",
										log,
										Object.keys(log[0] ?? {}),
									)
								}
								variant="outline"
							>
								Export CSV
							</Button>
							<Button onClick={printPage} variant="outline">
								Print
							</Button>
						</>
					}
					description="One gateway for slips, reports, recalls — delivery log + opt-out respect."
					title="Messaging"
				/>
				{error ? <p className="text-sm text-red-600">{error}</p> : null}
				<Card>
					<CardContent className="space-y-4 pt-6">
						<CardTitle className="text-base font-semibold">
							Templates ({templates.length})
						</CardTitle>
						<div className="grid gap-3 sm:grid-cols-3">
							<div className="space-y-1">
								<Label>Name</Label>
								<Input
									onChange={(e) => setTpl({ ...tpl, name: e.target.value })}
									value={tpl.name}
								/>
							</div>
							<div className="space-y-1">
								<Label>Kind</Label>
								<Input
									onChange={(e) => setTpl({ ...tpl, kind: e.target.value })}
									value={tpl.kind}
								/>
							</div>
							<div className="space-y-1">
								<Label>Body</Label>
								<Input
									onChange={(e) => setTpl({ ...tpl, body: e.target.value })}
									value={tpl.body}
								/>
							</div>
						</div>
						<Button onClick={() => void saveTemplate()}>Save template</Button>
						<div className="grid gap-3 sm:grid-cols-3">
							<div className="space-y-1">
								<Label>To</Label>
								<Input
									onChange={(e) => setSend({ ...send, to: e.target.value })}
									value={send.to}
								/>
							</div>
							<div className="space-y-1">
								<Label>Template</Label>
								<Input
									onChange={(e) =>
										setSend({ ...send, template: e.target.value })
									}
									value={send.template}
								/>
							</div>
							<div className="space-y-1">
								<Label>Channel</Label>
								<Input
									onChange={(e) =>
										setSend({ ...send, channel: e.target.value })
									}
									value={send.channel}
								/>
							</div>
						</div>
						<Button onClick={() => void sendMessage()} variant="outline">
							Send
						</Button>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="space-y-4 pt-6">
						<CardTitle className="text-base font-semibold">
							Recall rules ({rules.length})
						</CardTitle>
						<div className="grid gap-3 sm:grid-cols-3">
							<div className="space-y-1">
								<Label>Name</Label>
								<Input
									onChange={(e) => setRule({ ...rule, name: e.target.value })}
									value={rule.name}
								/>
							</div>
							<div className="space-y-1">
								<Label>Days after</Label>
								<Input
									onChange={(e) =>
										setRule({ ...rule, daysAfter: e.target.value })
									}
									value={rule.daysAfter}
								/>
							</div>
							<div className="space-y-1">
								<Label>Message</Label>
								<Input
									onChange={(e) =>
										setRule({ ...rule, message: e.target.value })
									}
									value={rule.message}
								/>
							</div>
						</div>
						<Button onClick={() => void saveRule()} variant="outline">
							Save recall rule
						</Button>
						<ul className="divide-y text-sm">
							{rules.map((r) => (
								<li className="py-2" key={r.id}>
									{r.name} · +{r.daysAfter}d
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="space-y-4 pt-6">
						<CardTitle className="text-base font-semibold">
							Delivery log ({log.length})
						</CardTitle>
						<Button onClick={() => void loadLog()} variant="outline">
							Load log
						</Button>
						<ul className="divide-y text-sm">
							{log.map((row, i) => (
								<li
									className="flex items-center justify-between gap-2 py-2"
									key={String(row.id ?? i)}
								>
									<span>
										{String(row.to ?? row.recipient ?? "—")} ·{" "}
										{String(row.status ?? "—")} · {String(row.channel ?? "")}
									</span>
									{typeof row.id === "string" ? (
										<Button
											onClick={() => void retry(row.id as string)}
											size="sm"
											variant="outline"
										>
											Retry
										</Button>
									) : null}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
