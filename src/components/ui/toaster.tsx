import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { useSyncExternalStore } from "react";

import { cn } from "#/lib/utils";

type ToastVariant = "default" | "error" | "success";

type ToastItem = {
	description?: string;
	id: number;
	title: string;
	variant: ToastVariant;
};

let nextId = 1;
let items: ToastItem[] = [];
const listeners = new Set<() => void>();
const timers = new Map<number, ReturnType<typeof setTimeout>>();

function emit() {
	for (const listener of listeners) {
		listener();
	}
}

function dismiss(id: number) {
	const timer = timers.get(id);
	if (timer) {
		clearTimeout(timer);
		timers.delete(id);
	}
	items = items.filter((item) => item.id !== id);
	emit();
}

function push(title: string, variant: ToastVariant, description?: string) {
	const id = nextId++;
	items = [...items.slice(-3), { description, id, title, variant }];
	emit();
	timers.set(
		id,
		setTimeout(() => dismiss(id), 5000),
	);
}

export const toast = {
	dismiss,
	error: (title: string, description?: string) =>
		push(title, "error", description),
	message: (title: string, description?: string) =>
		push(title, "default", description),
	success: (title: string, description?: string) =>
		push(title, "success", description),
};

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

function getSnapshot() {
	return items;
}

export function Toaster() {
	const toasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
	if (toasts.length === 0) {
		return null;
	}
	return (
		<div
			aria-live="polite"
			className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-80 flex-col gap-2"
		>
			{toasts.map((item) => (
				<div
					className={cn(
						"pointer-events-auto flex items-start gap-2.5 rounded-lg border bg-card p-3 shadow-shadow-xl",
						item.variant === "error" && "border-destructive/40",
					)}
					key={item.id}
					role={item.variant === "error" ? "alert" : "status"}
				>
					{item.variant === "error" ? (
						<AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
					) : item.variant === "success" ? (
						<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-cyan-edge" />
					) : null}
					<div className="min-w-0 flex-1">
						<p className="text-sm font-medium ">{item.title}</p>
						{item.description ? (
							<p className="mt-0.5 text-xs text-warm-gray">
								{item.description}
							</p>
						) : null}
					</div>
					<button
						aria-label="Dismiss notification"
						className="shrink-0 rounded p-0.5 text-warm-gray hover:"
						onClick={() => dismiss(item.id)}
						type="button"
					>
						<X className="size-3.5" />
					</button>
				</div>
			))}
		</div>
	);
}
