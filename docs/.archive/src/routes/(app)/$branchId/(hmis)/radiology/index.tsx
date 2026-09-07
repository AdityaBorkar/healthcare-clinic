import {
	IconAlertTriangle,
	IconCalendar,
	IconCheck,
	IconClock,
	IconDeviceDesktop,
	IconFileText,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import { Badge } from "#/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";

export const Route = createFileRoute("/(app)/$branchId/(hmis)/radiology/")({
	component: RadiologyOverview,
	head: () => ({
		meta: [{ title: "Radiology Overview (Shaun)" }],
	}),
});

const MOCK_STATS = {
	appointmentsToday: 24,
	completedToday: 16,
	equipmentAvailable: 5,
	equipmentMaintenance: 1,
	pendingReports: 8,
};

const MOCK_QUEUE = [
	{
		id: "1",
		patientName: "John Smith",
		patientType: "opd",
		priority: "routine",
		service: "CT Scan - Abdomen",
		status: "in-progress",
		time: "09:30",
	},
	{
		id: "2",
		patientName: "Mary Johnson",
		patientType: "ipd",
		priority: "urgent",
		service: "X-Ray - Chest",
		status: "checked-in",
		time: "10:00",
	},
	{
		id: "3",
		patientName: "Robert Davis",
		patientType: "opd",
		priority: "routine",
		service: "MRI - Brain",
		status: "scheduled",
		time: "10:30",
	},
	{
		id: "4",
		patientName: "Sarah Wilson",
		patientType: "opd",
		priority: "stat",
		service: "Ultrasound - Abdomen",
		status: "scheduled",
		time: "11:00",
	},
];

function RadiologyOverview() {
	return (
		<div className="space-y-6 p-6">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="font-medium text-sm">
							Today's Appointments
						</CardTitle>
						<IconCalendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{MOCK_STATS.appointmentsToday}
						</div>
						<p className="text-muted-foreground text-xs">8 remaining</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="font-medium text-sm">
							Pending Reports
						</CardTitle>
						<IconFileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{MOCK_STATS.pendingReports}
						</div>
						<p className="text-muted-foreground text-xs">Awaiting upload</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="font-medium text-sm">
							Completed Today
						</CardTitle>
						<IconCheck className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{MOCK_STATS.completedToday}
						</div>
						<p className="text-muted-foreground text-xs">Studies completed</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="font-medium text-sm">
							Equipment Status
						</CardTitle>
						<IconDeviceDesktop className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{MOCK_STATS.equipmentAvailable}/
							{MOCK_STATS.equipmentAvailable + MOCK_STATS.equipmentMaintenance}
						</div>
						<p className="text-muted-foreground text-xs">
							{MOCK_STATS.equipmentMaintenance} under maintenance
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<IconClock className="h-5 w-5" />
							Current Queue
						</CardTitle>
						<CardDescription>Today's appointment queue</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{MOCK_QUEUE.map((item, idx) => (
								<div
									className={`flex items-center justify-between rounded-lg border p-3 ${
										item.status === "in-progress"
											? "border-primary bg-primary/5"
											: ""
									}`}
									key={item.id}
								>
									<div className="flex items-center gap-3">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-medium text-sm">
											{idx + 1}
										</div>
										<div>
											<div className="flex items-center gap-2">
												<p className="font-medium">{item.patientName}</p>
												<Badge
													className={
														item.patientType === "ipd"
															? "bg-purple-100 text-purple-800"
															: "bg-blue-100 text-blue-800"
													}
													variant="secondary"
												>
													{item.patientType.toUpperCase()}
												</Badge>
												{item.priority === "stat" && (
													<Badge
														className="bg-red-100 text-red-800"
														variant="secondary"
													>
														STAT
													</Badge>
												)}
												{item.priority === "urgent" && (
													<Badge
														className="bg-amber-100 text-amber-800"
														variant="secondary"
													>
														URGENT
													</Badge>
												)}
											</div>
											<p className="text-muted-foreground text-sm">
												{item.service}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="font-medium">{item.time}</p>
										<Badge
											className={
												item.status === "in-progress"
													? "bg-green-100 text-green-800"
													: item.status === "checked-in"
														? "bg-blue-100 text-blue-800"
														: "bg-gray-100 text-gray-800"
											}
											variant="secondary"
										>
											{item.status === "in-progress"
												? "In Progress"
												: item.status === "checked-in"
													? "Checked In"
													: "Scheduled"}
										</Badge>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<IconAlertTriangle className="h-5 w-5" />
							Alerts & Notifications
						</CardTitle>
						<CardDescription>Items requiring attention</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
								<IconAlertTriangle className="h-5 w-5 text-amber-600" />
								<div>
									<p className="font-medium text-amber-800">
										MRI Scanner Maintenance
									</p>
									<p className="text-amber-700 text-sm">
										Scheduled maintenance tomorrow, 2:00 PM - 6:00 PM
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
								<IconFileText className="h-5 w-5 text-red-600" />
								<div>
									<p className="font-medium text-red-800">
										3 STAT Reports Pending
									</p>
									<p className="text-red-700 text-sm">
										Urgent reports awaiting upload
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
								<IconCalendar className="h-5 w-5 text-blue-600" />
								<div>
									<p className="font-medium text-blue-800">Schedule Update</p>
									<p className="text-blue-700 text-sm">
										CT Scanner back online after calibration
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
