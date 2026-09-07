import {
	IconCalendar,
	IconCertificate,
	IconClock,
	IconCreditCard,
	IconMail,
	IconStethoscope,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { client } from "#/lib/rpc";

export const Route = createFileRoute("/(app)/(erp)/practitioners/$id/")({
	component: PractitionerProfilePage,
	head: () => ({
		meta: [{ title: "Practitioner Profile (Shaun)" }],
	}),
});

const DAY_NAMES = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

function PractitionerProfilePage() {
	const { id } = Route.useParams();

	const { data: doctor, isLoading } = useQuery({
		queryFn: async () => {
			return await client.doctors.get({ id: Number(id) });
		},
		queryKey: ["doctor", id],
	});

	if (isLoading) {
		return (
			<div className="p-6">
				<div className="text-muted-foreground">
					Loading practitioner profile...
				</div>
			</div>
		);
	}

	if (!doctor) {
		return (
			<div className="p-6">
				<div className="text-muted-foreground">Practitioner not found</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-6xl space-y-6 p-6">
			<div className="flex items-center gap-2 text-muted-foreground text-sm">
				<Link className="hover:text-foreground" to="/practitioners">
					Practitioners
				</Link>
				<span>/</span>
				<span className="text-foreground">{doctor.name}</span>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<Card className="lg:col-span-1">
					<CardContent className="pt-6">
						<div className="flex flex-col items-center gap-4">
							<Avatar className="h-32 w-32">
								<AvatarImage
									alt={doctor.name}
									src={doctor.photoKey || undefined}
								/>
								<AvatarFallback className="bg-primary/10 text-2xl text-primary">
									{doctor.name.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="text-center">
								<h2 className="font-bold text-xl">{doctor.name}</h2>
								<p className="text-muted-foreground">{doctor.doctorId}</p>
							</div>
							<div className="flex gap-2">
								<Badge
									className={
										doctor.isActive
											? "bg-green-100 text-green-800"
											: "bg-gray-100 text-gray-800"
									}
								>
									{doctor.isActive ? "Active" : "Inactive"}
								</Badge>
								<Badge
									className={
										doctor.isVerified
											? "bg-blue-100 text-blue-800"
											: "bg-yellow-100 text-yellow-800"
									}
								>
									{doctor.isVerified ? "Verified" : "Pending Verification"}
								</Badge>
							</div>
							<Link
								params={{ id: doctor.id.toString() }}
								to="/practitioners/$id/availability"
							>
								<Button className="gap-2">
									<IconCalendar className="h-4 w-4" />
									Manage Availability
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>

				<div className="space-y-6 lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<IconStethoscope className="h-5 w-5" />
								Professional Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4 sm:grid-cols-2">
								<div>
									<p className="text-muted-foreground text-sm">
										Registration Number
									</p>
									<p className="font-medium">{doctor.registrationNumber}</p>
								</div>
								<div>
									<p className="text-muted-foreground text-sm">
										Registration Council
									</p>
									<p className="font-medium">
										{doctor.registrationCouncil || "-"}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground text-sm">Qualification</p>
									<p className="font-medium">{doctor.qualification}</p>
								</div>
								<div>
									<p className="text-muted-foreground text-sm">
										Additional Qualifications
									</p>
									<p className="font-medium">
										{doctor.additionalQualifications || "-"}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground text-sm">
										Practicing Since
									</p>
									<p className="font-medium">{doctor.practicingSince || "-"}</p>
								</div>
								<div>
									<p className="text-muted-foreground text-sm">
										Default Slot Duration
									</p>
									<p className="font-medium">
										{doctor.defaultSlotDuration || 15} minutes
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<IconCertificate className="h-5 w-5" />
								Specializations
							</CardTitle>
							<CardDescription>Areas of medical expertise</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								{doctor.specializations.length > 0 ? (
									doctor.specializations.map((s) => (
										<Badge
											className={
												s.isPrimary
													? "bg-primary text-primary-foreground"
													: undefined
											}
											key={s.id}
											variant={s.isPrimary ? "default" : "secondary"}
										>
											{s.specialization.name}
											{s.isPrimary ? " (Primary)" : null}
										</Badge>
									))
								) : (
									<p className="text-muted-foreground">
										No specializations assigned
									</p>
								)}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<IconMail className="h-5 w-5" />
								Contact Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4 sm:grid-cols-2">
								<div>
									<p className="text-muted-foreground text-sm">Email</p>
									<p className="font-medium">{doctor.email}</p>
								</div>
								<div>
									<p className="text-muted-foreground text-sm">Phone</p>
									<p className="font-medium">{doctor.phone || "-"}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{doctor.bio ? (
						<Card>
							<CardHeader>
								<CardTitle>Bio</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">{doctor.bio}</p>
							</CardContent>
						</Card>
					) : null}
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<IconCreditCard className="h-5 w-5" />
						Bank Accounts
					</CardTitle>
					<CardDescription>Registered bank accounts</CardDescription>
				</CardHeader>
				<CardContent>
					{doctor.bankAccounts && doctor.bankAccounts.length > 0 ? (
						<div className="grid gap-3">
							{doctor.bankAccounts.map((account) => (
								<div
									className="flex items-center justify-between rounded-lg border p-3"
									key={account.id}
								>
									<div>
										<p className="font-medium">{account.bankName}</p>
										<p className="text-muted-foreground text-sm">
											{account.accountHolderName} | A/C: {account.accountNumber}
										</p>
										<p className="text-muted-foreground text-xs">
											IFSC: {account.ifscCode}
											{account.bankBranch
												? ` | Branch: ${account.bankBranch}`
												: null}
										</p>
									</div>
									{account.isDefault ? (
										<Badge className="bg-green-100 text-green-800">
											Default
										</Badge>
									) : null}
								</div>
							))}
						</div>
					) : (
						<p className="py-4 text-center text-muted-foreground">
							No bank accounts added
						</p>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<IconClock className="h-5 w-5" />
						Weekly Schedule
					</CardTitle>
					<CardDescription>
						OPD and IPD availability schedule
						<Link
							className="ml-2 text-primary hover:underline"
							params={{ id: doctor.id.toString() }}
							to="/practitioners/$id/availability"
						>
							Edit schedule
						</Link>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs className="flex flex-col" defaultValue="opd">
						<TabsList>
							<TabsTrigger value="opd">OPD Schedule</TabsTrigger>
							<TabsTrigger value="ipd">IPD Schedule</TabsTrigger>
						</TabsList>
						<TabsContent className="mt-4" value="opd">
							{doctor.opdAvailability.length > 0 ? (
								<div className="grid gap-3">
									{(() => {
										const grouped: Record<
											number,
											typeof doctor.opdAvailability
										> = {};
										for (const s of doctor.opdAvailability) {
											if (!grouped[s.dayOfWeek]) {
												grouped[s.dayOfWeek] = [];
											}
											grouped[s.dayOfWeek].push(s);
										}
										return Object.entries(grouped)
											.sort(([a], [b]) => Number(a) - Number(b))
											.map(([dayOfWeek, schedules]) => (
												<div className="rounded-lg border p-3" key={dayOfWeek}>
													<p className="font-medium">
														{DAY_NAMES[Number(dayOfWeek)]}
													</p>
													<div className="mt-1 space-y-1">
														{schedules.map((schedule) => (
															<div
																className="flex items-center justify-between text-sm"
																key={schedule.id}
															>
																<p className="text-muted-foreground">
																	{schedule.startTime} - {schedule.endTime}
																</p>
																<p className="text-muted-foreground text-xs">
																	{schedule.branch?.name} | Default Room:{" "}
																	{schedule.roomNumber || "TBD"} |{" "}
																	{schedule.slotDuration || 15}min slots
																</p>
															</div>
														))}
													</div>
												</div>
											));
									})()}
								</div>
							) : (
								<p className="py-8 text-center text-muted-foreground">
									No OPD schedule configured
								</p>
							)}
						</TabsContent>
						<TabsContent className="mt-4" value="ipd">
							{doctor.ipdAvailability.length > 0 ? (
								<div className="grid gap-3">
									{(() => {
										const grouped: Record<
											number,
											typeof doctor.ipdAvailability
										> = {};
										for (const s of doctor.ipdAvailability) {
											if (!grouped[s.dayOfWeek]) {
												grouped[s.dayOfWeek] = [];
											}
											grouped[s.dayOfWeek].push(s);
										}
										return Object.entries(grouped)
											.sort(([a], [b]) => Number(a) - Number(b))
											.map(([dayOfWeek, schedules]) => (
												<div className="rounded-lg border p-3" key={dayOfWeek}>
													<p className="font-medium">
														{DAY_NAMES[Number(dayOfWeek)]}
													</p>
													<div className="mt-1 space-y-1">
														{schedules.map((schedule) => (
															<div
																className="flex items-center justify-between text-sm"
																key={schedule.id}
															>
																<p className="text-muted-foreground">
																	Visit: {schedule.visitStartTime} -{" "}
																	{schedule.visitEndTime}
																</p>
																<p className="text-muted-foreground text-xs">
																	{schedule.branch?.name} | Rounds:{" "}
																	{schedule.wardRoundTime || "N/A"} | Max:{" "}
																	{schedule.maxAdmissions || "Unlimited"}{" "}
																	admissions
																</p>
															</div>
														))}
													</div>
												</div>
											));
									})()}
								</div>
							) : (
								<p className="py-8 text-center text-muted-foreground">
									No IPD schedule configured
								</p>
							)}
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
