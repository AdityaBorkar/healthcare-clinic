import { IconFilter } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { client } from "#/lib/rpc";

export const Route = createFileRoute("/(app)/(erp)/hr/audit-trail/")({
	component: AuditTrail,
	head: () => ({
		meta: [{ title: "HR Audit Trail (Shaun)" }],
	}),
});

function AuditTrail() {
	const [filters, setFilters] = useState({
		dateFrom: "",
		dateTo: "",
		entity: "",
		operation: "",
		userId: "",
	});

	const { data: entries, isLoading } = useQuery({
		queryFn: async () =>
			await client.cdc.getGlobalAuditLog({
				dateFrom: filters.dateFrom
					? new Date(filters.dateFrom).toISOString()
					: undefined,
				dateTo: filters.dateTo
					? new Date(filters.dateTo).toISOString()
					: undefined,
				entity: filters.entity || undefined,
				limit: 100,
				offset: 0,
				operation: filters.operation || undefined,
				userId: filters.userId || undefined,
			}),
		queryKey: ["globalAuditLog", filters],
	});

	const updateFilter = (field: string, value: string) => {
		setFilters((prev) => ({ ...prev, [field]: value }));
	};

	const clearFilters = () => {
		setFilters({
			dateFrom: "",
			dateTo: "",
			entity: "",
			operation: "",
			userId: "",
		});
	};

	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="font-bold text-2xl">Audit Trail</h1>
				<p className="text-muted-foreground">
					View all system changes and activities
				</p>
			</div>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<IconFilter className="h-5 w-5" />
						Filters
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 sm:grid-cols-3">
						<div className="space-y-2">
							<Label>User ID</Label>
							<Input
								onChange={(e) => updateFilter("userId", e.target.value)}
								placeholder="Filter by user ID"
								value={filters.userId}
							/>
						</div>
						<div className="space-y-2">
							<Label>Entity</Label>
							<Select
								onValueChange={(v) => {
									if (v) updateFilter("entity", v);
								}}
								value={filters.entity}
							>
								<SelectTrigger>
									<SelectValue placeholder="All entities" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="staff">Staff</SelectItem>
									<SelectItem value="patients">Patients</SelectItem>
									<SelectItem value="doctors">Doctors</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Operation</Label>
							<Select
								onValueChange={(v) => {
									if (v) updateFilter("operation", v);
								}}
								value={filters.operation}
							>
								<SelectTrigger>
									<SelectValue placeholder="All operations" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="INSERT">Insert</SelectItem>
									<SelectItem value="UPDATE">Update</SelectItem>
									<SelectItem value="DELETE">Delete</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Date From</Label>
							<Input
								onChange={(e) => updateFilter("dateFrom", e.target.value)}
								type="date"
								value={filters.dateFrom}
							/>
						</div>
						<div className="space-y-2">
							<Label>Date To</Label>
							<Input
								onChange={(e) => updateFilter("dateTo", e.target.value)}
								type="date"
								value={filters.dateTo}
							/>
						</div>
						<div className="flex items-end">
							<Button onClick={clearFilters} variant="outline">
								Clear Filters
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Changes ({entries?.length ?? 0} entries)</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="py-8 text-center text-muted-foreground">
							Loading audit log...
						</div>
					) : !entries || entries.length === 0 ? (
						<div className="py-8 text-center text-muted-foreground">
							No audit entries found.
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Timestamp</TableHead>
									<TableHead>User</TableHead>
									<TableHead>Entity</TableHead>
									<TableHead>Record</TableHead>
									<TableHead>Operation</TableHead>
									<TableHead>Field</TableHead>
									<TableHead>Old Value</TableHead>
									<TableHead>New Value</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{entries.map((entry) => (
									<TableRow key={entry.id}>
										<TableCell className="text-xs">
											{entry.timestamp
												? new Date(entry.timestamp).toLocaleString()
												: ""}
										</TableCell>
										<TableCell className="font-mono text-xs">
											{entry.userId}
										</TableCell>
										<TableCell>
											<Badge variant="outline">{entry.sourceTable}</Badge>
										</TableCell>
										<TableCell className="font-mono text-xs">
											{entry.sourceId}
										</TableCell>
										<TableCell>
											<Badge
												variant={
													entry.operation === "INSERT"
														? "default"
														: entry.operation === "DELETE"
															? "destructive"
															: "secondary"
												}
											>
												{entry.operation}
											</Badge>
										</TableCell>
										<TableCell>{entry.field}</TableCell>
										<TableCell className="max-w-[200px] truncate text-xs">
											{entry.oldValue ?? "—"}
										</TableCell>
										<TableCell className="max-w-[200px] truncate text-xs">
											{entry.newValue ?? "—"}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
