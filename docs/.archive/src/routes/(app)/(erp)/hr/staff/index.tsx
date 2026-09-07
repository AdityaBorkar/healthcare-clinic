import {
	IconLayoutGrid,
	IconPlus,
	IconSearch,
	IconTable,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { client } from "#/lib/rpc";
import type { StaffWithUser } from "#/rpc/router/staff";

export const Route = createFileRoute("/(app)/(erp)/hr/staff/")({
	component: StaffList,
	head: () => ({
		meta: [{ title: "Staff (Shaun)" }],
	}),
});

function StaffList() {
	const [search, setSearch] = useState("");
	const [viewMode, setViewMode] = useState<"table" | "grid">("table");

	const { data: staffList, isLoading } = useQuery({
		queryFn: async () => await client.staff.list({}),
		queryKey: ["staff"],
	});

	const filteredStaff = staffList?.filter(
		(s) =>
			s.user?.name.toLowerCase().includes(search.toLowerCase()) ||
			s.employeeId.toLowerCase().includes(search.toLowerCase()) ||
			s.user?.email.toLowerCase().includes(search.toLowerCase()) ||
			s.department?.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className="p-6">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl">Staff Management</h1>
					<p className="text-muted-foreground">
						Manage staff records, roles, and permissions
					</p>
				</div>
				<Link to="/hr/staff/new">
					<Button>
						<IconPlus className="mr-2 h-4 w-4" />
						Add Staff
					</Button>
				</Link>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Staff Directory</CardTitle>
							<CardDescription>
								{filteredStaff?.length ?? 0} staff members found
							</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							<Button
								onClick={() => setViewMode("table")}
								size="icon"
								variant={viewMode === "table" ? "default" : "outline"}
							>
								<IconTable className="h-4 w-4" />
							</Button>
							<Button
								onClick={() => setViewMode("grid")}
								size="icon"
								variant={viewMode === "grid" ? "default" : "outline"}
							>
								<IconLayoutGrid className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="mb-4 flex items-center gap-2">
						<div className="relative flex-1">
							<IconSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								className="pl-9"
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search by name, employee ID, email, or department..."
								value={search}
							/>
						</div>
					</div>

					{isLoading ? (
						<div className="py-8 text-center text-muted-foreground">
							Loading staff...
						</div>
					) : viewMode === "table" ? (
						<StaffTable staff={filteredStaff as StaffWithUser[]} />
					) : (
						<StaffGrid staff={filteredStaff as StaffWithUser[]} />
					)}
				</CardContent>
			</Card>
		</div>
	);
}

function StaffTable({ staff }: { staff: StaffWithUser[] }) {
	if (!staff || staff.length === 0) {
		return (
			<div className="py-8 text-center text-muted-foreground">
				No staff members found. Click "Add Staff" to add a new member.
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Staff</TableHead>
					<TableHead>Employee ID</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Department</TableHead>
					<TableHead>Branch</TableHead>
					<TableHead>Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{staff.map((member) => (
					<TableRow key={member.id}>
						<TableCell>
							<Link params={{ id: String(member.id) }} to="/hr/staff/$id">
								<div className="flex items-center gap-3">
									<Avatar className="h-8 w-8">
										<AvatarImage src={member.user?.image ?? undefined} />
										<AvatarFallback>
											{member.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="font-medium">{member.user?.name}</p>
										<p className="text-muted-foreground text-xs">
											{member.user?.email}
										</p>
									</div>
								</div>
							</Link>
						</TableCell>
						<TableCell className="font-mono text-xs">
							{member.employeeId}
						</TableCell>
						<TableCell>
							<Badge variant="secondary">{member.roleId}</Badge>
						</TableCell>
						<TableCell>{member.department ?? "—"}</TableCell>
						<TableCell>{member.branch?.name ?? "—"}</TableCell>
						<TableCell>
							<Badge variant={member.isActive ? "default" : "destructive"}>
								{member.isActive ? "Active" : "Inactive"}
							</Badge>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function StaffGrid({ staff }: { staff: StaffWithUser[] }) {
	if (!staff || staff.length === 0) {
		return (
			<div className="py-8 text-center text-muted-foreground">
				No staff members found. Click "Add Staff" to add a new member.
			</div>
		);
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{staff.map((member) => (
				<Link
					key={member.id}
					params={{ id: String(member.id) }}
					to="/hr/staff/$id"
				>
					<Card className="transition-shadow hover:shadow-md">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Avatar className="h-12 w-12">
									<AvatarImage src={member.user?.image ?? undefined} />
									<AvatarFallback>
										{member.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
									</AvatarFallback>
								</Avatar>
								<div className="min-w-0 flex-1">
									<p className="truncate font-medium">{member.user?.name}</p>
									<p className="truncate text-muted-foreground text-xs">
										{member.employeeId}
									</p>
								</div>
								<Badge variant={member.isActive ? "default" : "destructive"}>
									{member.isActive ? "Active" : "Inactive"}
								</Badge>
							</div>
							<div className="mt-3 flex flex-wrap gap-1">
								<Badge variant="secondary">{member.roleId}</Badge>
								{member.department && (
									<Badge variant="outline">{member.department}</Badge>
								)}
							</div>
							{member.branch && (
								<p className="mt-2 text-muted-foreground text-xs">
									{member.branch.name}
								</p>
							)}
						</CardContent>
					</Card>
				</Link>
			))}
		</div>
	);
}
