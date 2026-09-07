import { IconPlus, IconSearch, IconUsers } from "@tabler/icons-react";
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

export const Route = createFileRoute("/(app)/$branchId/(hmis)/emr/")({
	component: EmrPatientList,
	head: () => ({
		meta: [{ title: "EMR (Shaun)" }],
	}),
});

function EmrPatientList() {
	const { branchId } = Route.useParams();
	const [search, setSearch] = useState("");

	const { data: patients, isLoading } = useQuery({
		queryFn: async () =>
			await client.patients.list({ activeOnly: true, search }),
		queryKey: ["patients", search],
	});

	return (
		<div className="p-6">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl">Patients</h1>
					<p className="text-muted-foreground">
						Manage patient records and medical information
					</p>
				</div>
				<Link params={{ branchId }} to="/$branchId/emr/new">
					<Button>
						<IconPlus data-icon="inline-start" />
						New Patient
					</Button>
				</Link>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Patient Records</CardTitle>
							<CardDescription>
								{patients?.length ?? 0} patients found
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="mb-4">
						<div className="relative">
							<IconSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								className="pl-9"
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search by name, MRN, or phone..."
								value={search}
							/>
						</div>
					</div>

					{isLoading ? (
						<div className="py-8 text-center text-muted-foreground">
							Loading patients...
						</div>
					) : patients && patients.length > 0 ? (
						<PatientTable branchId={branchId} patients={patients} />
					) : (
						<div className="flex flex-col items-center gap-2 py-8">
							<IconUsers className="size-8 text-muted-foreground" />
							<p className="text-muted-foreground">
								No patients found. Click &quot;New Patient&quot; to register
								one.
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

function PatientTable({
	patients,
	branchId,
}: {
	patients: Array<{
		id: number;
		name: string;
		mrn: string | null;
		phone: string | null;
		gender: string | null;
		birthDate: string | null;
		bloodGroup: string | null;
		active: boolean;
		photoUrl: string | null;
	}>;
	branchId: string;
}) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Patient</TableHead>
					<TableHead>MRN</TableHead>
					<TableHead>Gender</TableHead>
					<TableHead>DOB</TableHead>
					<TableHead>Blood Group</TableHead>
					<TableHead>Phone</TableHead>
					<TableHead>Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{patients.map((patient) => {
					const initials = patient.name
						.split(" ")
						.map((n) => n[0])
						.join("")
						.toUpperCase()
						.slice(0, 2);

					return (
						<TableRow key={patient.id}>
							<TableCell>
								<Link
									params={{ branchId, patientId: String(patient.id) }}
									to="/$branchId/emr/$patientId"
								>
									<div className="flex items-center gap-3">
										<Avatar className="size-8">
											<AvatarImage
												alt={patient.name}
												src={patient.photoUrl ?? undefined}
											/>
											<AvatarFallback>{initials}</AvatarFallback>
										</Avatar>
										<p className="font-medium">{patient.name}</p>
									</div>
								</Link>
							</TableCell>
							<TableCell className="font-mono text-xs">
								{patient.mrn ?? "\u2014"}
							</TableCell>
							<TableCell className="capitalize">
								{patient.gender ?? "\u2014"}
							</TableCell>
							<TableCell>{patient.birthDate ?? "\u2014"}</TableCell>
							<TableCell>
								{patient.bloodGroup ? (
									<Badge variant="outline">{patient.bloodGroup}</Badge>
								) : (
									"\u2014"
								)}
							</TableCell>
							<TableCell>{patient.phone ?? "\u2014"}</TableCell>
							<TableCell>
								<Badge variant={patient.active ? "default" : "destructive"}>
									{patient.active ? "Active" : "Inactive"}
								</Badge>
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
