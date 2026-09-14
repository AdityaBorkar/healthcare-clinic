import { useEffect, useState } from "react";

import { Button } from "#/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { useBranch } from "#/lib/branch-store";
import { orpc } from "#/lib/rpc";

type Branch = { id: string; name: string; subdomain?: string };

/** Header branch selector (P0-1): switches branch context for all lists. */
export function BranchSelector({ compact = false }: { compact?: boolean }) {
	const [branchId, setBranchId] = useBranch();
	const [branches, setBranches] = useState<Array<Branch>>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let live = true;
		orpc.admin
			.listBranches()
			.then((rows) => {
				if (live) setBranches(rows as Array<Branch>);
			})
			.catch((err: unknown) => {
				if (live)
					setError(err instanceof Error ? err.message : "Branch load failed");
			});
		return () => {
			live = false;
		};
	}, []);

	const options =
		branches.length > 0 ? branches : [{ id: "main", name: "Main branch" }];

	return (
		<div className="flex items-center gap-2">
			<span className="hidden text-xs text-muted-foreground sm:inline">
				Branch
			</span>
			<Select onValueChange={(v) => setBranchId(v ?? "main")} value={branchId}>
				<SelectTrigger
					aria-label="Select branch"
					className={compact ? "h-8 max-w-40" : "max-w-52"}
				>
					<SelectValue placeholder="Select branch" />
				</SelectTrigger>
				<SelectContent>
					{options.map((b) => (
						<SelectItem key={b.id} value={b.id}>
							{b.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{error ? (
				<span className="sr-only" role="alert">
					{error}
				</span>
			) : null}
		</div>
	);
}

/** Hidden helper so pages can read branch without importing the hook file. */
export function BranchLoadError({ message }: { message: string | null }) {
	if (!message) return null;
	return <p className="text-sm text-red-600">{message}</p>;
}

export function NoBranchSelected() {
	return <Button disabled>Select a branch</Button>;
}
