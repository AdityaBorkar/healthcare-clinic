import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";

type Action = {
	description: string;
	href: string;
	keywords: string;
	steps: string;
	title: string;
};

const ACTIONS: Array<Action> = [
	{
		description: "Find patient / appointment / service",
		href: "/reception/book",
		keywords: "search find patient appointment service global",
		steps: "Type query -> pick result",
		title: "Global search",
	},
	{
		description: "Patient + practitioner + slot in one action",
		href: "/reception/book",
		keywords: "book appointment schedule opd token",
		steps: "Pick patient -> pick slot -> confirm",
		title: "Book appointment",
	},
	{
		description: "Register then book from the same form",
		href: "/reception/register",
		keywords: "register new patient opd signup",
		steps: "Dedupe -> register -> book",
		title: "Register patient",
	},
	{
		description: "Raise an invoice and collect at the desk",
		href: "/billing/desk",
		keywords: "collect payment bill invoice cash",
		steps: "Raise invoice -> collect",
		title: "Collect payment",
	},
	{
		description: "Check in from the queue board",
		href: "/reception/queue",
		keywords: "encounter start checkin queue call next",
		steps: "Open queue -> call next -> check in",
		title: "Start encounter",
	},
	{
		description: "Day view of practitioner availability",
		href: "/appointments/calendar",
		keywords: "calendar slots availability",
		steps: "Pick doctor -> pick date",
		title: "View calendar",
	},
];

let paletteOpen = false;
const listeners = new Set<(open: boolean) => void>();

function setPalette(open: boolean): void {
	paletteOpen = open;
	for (const l of listeners) l(open);
}

export function openCommandPalette(): void {
	setPalette(true);
}

/** Command palette (P0-6): Ctrl+K, book/collect/start-encounter in <=3 steps. */
export function CommandPalette() {
	const [open, setOpen] = useState(paletteOpen);
	const [query, setQuery] = useState("");
	const navigate = useNavigate();
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const l = (v: boolean) => {
			setOpen(v);
			if (v) setQuery("");
		};
		listeners.add(l);
		return () => {
			listeners.delete(l);
		};
	}, []);

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setPalette(!paletteOpen);
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	useEffect(() => {
		if (open) setTimeout(() => inputRef.current?.focus(), 30);
	}, [open]);

	const results = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return ACTIONS;
		return ACTIONS.filter((a) =>
			`${a.title} ${a.description} ${a.keywords}`.toLowerCase().includes(q),
		);
	}, [query]);

	const go = useCallback(
		(href: string) => {
			setPalette(false);
			void navigate({ to: href });
		},
		[navigate],
	);

	return (
		<Dialog onOpenChange={setPalette} open={open}>
			<DialogContent aria-label="Command palette" className="max-w-lg p-0">
				<DialogTitle className="sr-only">Command palette</DialogTitle>
				<div className="border-b border-border p-3">
					<Input
						aria-label="Type a command"
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && results[0]) go(results[0].href);
						}}
						placeholder="Type a command — book, collect, encounter… (Ctrl+K)"
						ref={inputRef}
						value={query}
					/>
				</div>
				<ul className="max-h-80 overflow-y-auto p-2">
					{results.map((a) => (
						<li key={a.title}>
							<button
								className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
								onClick={() => go(a.href)}
								type="button"
							>
								<span>
									<span className="block font-medium">{a.title}</span>
									<span className="block text-xs text-muted-foreground">
										{a.steps}
									</span>
								</span>
								<span className="shrink-0 text-xs text-muted-foreground">
									{a.description}
								</span>
							</button>
						</li>
					))}
					{results.length === 0 ? (
						<li className="px-3 py-6 text-center text-sm text-muted-foreground">
							No matching commands.
						</li>
					) : null}
				</ul>
			</DialogContent>
		</Dialog>
	);
}
