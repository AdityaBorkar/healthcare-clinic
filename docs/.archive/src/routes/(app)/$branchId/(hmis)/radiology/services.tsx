import {
	IconClock,
	IconCurrencyDollar,
	IconPencil,
	IconPlus,
	IconSettings,
	IconTrash,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Switch } from "#/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { cn } from "#/lib/utils";

export const Route = createFileRoute(
	"/(app)/$branchId/(hmis)/radiology/services",
)({
	component: RadiologyServices,
	head: () => ({
		meta: [{ title: "Radiology Services (Shaun)" }],
	}),
});

const MODALITIES = [
	{ id: "xray", label: "X-Ray" },
	{ id: "ct", label: "CT Scan" },
	{ id: "mri", label: "MRI" },
	{ id: "ultrasound", label: "Ultrasound" },
	{ id: "mammography", label: "Mammography" },
	{ id: "pet", label: "PET Scan" },
	{ id: "fluoroscopy", label: "Fluoroscopy" },
	{ id: "dexa", label: "DEXA Scan" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MOCK_SERVICES = [
	{
		code: "CPT-71046",
		defaultDuration: 15,
		id: "1",
		isActive: true,
		modality: "xray",
		name: "X-Ray Chest PA View",
		preparationInstructions: "No preparation required",
	},
	{
		code: "CPT-74177",
		defaultDuration: 30,
		id: "2",
		isActive: true,
		modality: "ct",
		name: "CT Scan - Abdomen",
		preparationInstructions:
			"Fasting 4 hours prior. Oral contrast may be required.",
	},
	{
		code: "CPT-70553",
		defaultDuration: 45,
		id: "3",
		isActive: true,
		modality: "mri",
		name: "MRI - Brain",
		preparationInstructions:
			"Remove all metallic objects. Screening for implants required.",
	},
	{
		code: "CPT-76700",
		defaultDuration: 30,
		id: "4",
		isActive: true,
		modality: "ultrasound",
		name: "Ultrasound - Abdomen Complete",
		preparationInstructions: "Fasting 6-8 hours prior.",
	},
	{
		code: "CPT-77067",
		defaultDuration: 20,
		id: "5",
		isActive: false,
		modality: "mammography",
		name: "Mammography - Bilateral",
		preparationInstructions:
			"Schedule after menstruation. Avoid deodorant/lotion.",
	},
];

const MOCK_FACILITIES = [
	{
		id: "1",
		modality: "xray",
		name: "X-Ray Room 1",
		operatingHours: [
			{ dayOfWeek: 1, endTime: "17:00", startTime: "08:00" },
			{ dayOfWeek: 2, endTime: "17:00", startTime: "08:00" },
			{ dayOfWeek: 3, endTime: "17:00", startTime: "08:00" },
			{ dayOfWeek: 4, endTime: "17:00", startTime: "08:00" },
			{ dayOfWeek: 5, endTime: "17:00", startTime: "08:00" },
		],
		roomNumber: "RAD-101",
		status: "available" as const,
	},
	{
		id: "2",
		modality: "ct",
		name: "CT Scanner",
		operatingHours: [
			{ dayOfWeek: 1, endTime: "20:00", startTime: "08:00" },
			{ dayOfWeek: 2, endTime: "20:00", startTime: "08:00" },
			{ dayOfWeek: 3, endTime: "20:00", startTime: "08:00" },
			{ dayOfWeek: 4, endTime: "20:00", startTime: "08:00" },
			{ dayOfWeek: 5, endTime: "20:00", startTime: "08:00" },
			{ dayOfWeek: 6, endTime: "14:00", startTime: "09:00" },
		],
		roomNumber: "RAD-201",
		status: "available" as const,
	},
	{
		id: "3",
		modality: "mri",
		name: "MRI Scanner",
		operatingHours: [
			{ dayOfWeek: 1, endTime: "18:00", startTime: "08:00" },
			{ dayOfWeek: 2, endTime: "18:00", startTime: "08:00" },
			{ dayOfWeek: 3, endTime: "18:00", startTime: "08:00" },
			{ dayOfWeek: 4, endTime: "18:00", startTime: "08:00" },
			{ dayOfWeek: 5, endTime: "18:00", startTime: "08:00" },
		],
		roomNumber: "RAD-301",
		status: "maintenance" as const,
	},
	{
		id: "4",
		modality: "ultrasound",
		name: "Ultrasound Room 1",
		operatingHours: [
			{ dayOfWeek: 1, endTime: "17:00", startTime: "08:00" },
			{ dayOfWeek: 2, endTime: "17:00", startTime: "08:00" },
			{ dayOfWeek: 3, endTime: "17:00", startTime: "08:00" },
			{ dayOfWeek: 4, endTime: "17:00", startTime: "08:00" },
			{ dayOfWeek: 5, endTime: "17:00", startTime: "08:00" },
		],
		roomNumber: "RAD-102",
		status: "available" as const,
	},
];

const MOCK_PRICING = [
	{
		emergency: 1000,
		serviceId: "1",
		serviceName: "X-Ray Chest PA View",
		standard: 500,
		urgent: 750,
	},
	{
		emergency: 16000,
		serviceId: "2",
		serviceName: "CT Scan - Abdomen",
		standard: 8000,
		urgent: 12000,
	},
	{
		emergency: 24000,
		serviceId: "3",
		serviceName: "MRI - Brain",
		standard: 12000,
		urgent: 18000,
	},
	{
		emergency: 3000,
		serviceId: "4",
		serviceName: "Ultrasound - Abdomen",
		standard: 1500,
		urgent: 2250,
	},
	{
		emergency: 5000,
		serviceId: "5",
		serviceName: "Mammography - Bilateral",
		standard: 2500,
		urgent: 3750,
	},
];

function RadiologyServices() {
	const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
	const [facilityDialogOpen, setFacilityDialogOpen] = useState(false);
	const [editingService, setEditingService] = useState<
		(typeof MOCK_SERVICES)[0] | null
	>(null);
	const [editingFacility, setEditingFacility] = useState<
		(typeof MOCK_FACILITIES)[0] | null
	>(null);

	const [serviceForm, setServiceForm] = useState({
		code: "",
		defaultDuration: 15,
		isActive: true,
		modality: "xray",
		name: "",
		preparationInstructions: "",
	});

	const [facilityForm, setFacilityForm] = useState({
		modality: "xray",
		name: "",
		roomNumber: "",
		status: "available" as "available" | "maintenance",
	});

	const [pricingEdits, setPricingEdits] = useState<
		Record<string, { standard: number; urgent: number; emergency: number }>
	>({});

	const handleEditService = (service: (typeof MOCK_SERVICES)[0]) => {
		setEditingService(service);
		setServiceForm({
			code: service.code,
			defaultDuration: service.defaultDuration,
			isActive: service.isActive,
			modality: service.modality,
			name: service.name,
			preparationInstructions: service.preparationInstructions,
		});
		setServiceDialogOpen(true);
	};

	const handleEditFacility = (facility: (typeof MOCK_FACILITIES)[0]) => {
		setEditingFacility(facility);
		setFacilityForm({
			modality: facility.modality,
			name: facility.name,
			roomNumber: facility.roomNumber,
			status: facility.status,
		});
		setFacilityDialogOpen(true);
	};

	const resetServiceForm = () => {
		setServiceForm({
			code: "",
			defaultDuration: 15,
			isActive: true,
			modality: "xray",
			name: "",
			preparationInstructions: "",
		});
		setEditingService(null);
	};

	const resetFacilityForm = () => {
		setFacilityForm({
			modality: "xray",
			name: "",
			roomNumber: "",
			status: "available",
		});
		setEditingFacility(null);
	};

	return (
		<div className="space-y-6 p-6">
			<div>
				<h1 className="font-bold text-2xl">Services & Facilities</h1>
				<p className="text-muted-foreground">
					Manage radiology services, equipment, pricing, and scheduling hours
				</p>
			</div>

			<Tabs className="flex flex-col" defaultValue="services">
				<TabsList>
					<TabsTrigger className="gap-2" value="services">
						<IconSettings className="h-4 w-4" />
						Services
					</TabsTrigger>
					<TabsTrigger className="gap-2" value="facilities">
						<IconSettings className="h-4 w-4" />
						Facilities
					</TabsTrigger>
					<TabsTrigger className="gap-2" value="pricing">
						<IconCurrencyDollar className="h-4 w-4" />
						Pricing
					</TabsTrigger>
					<TabsTrigger className="gap-2" value="hours">
						<IconClock className="h-4 w-4" />
						Schedule Hours
					</TabsTrigger>
				</TabsList>

				<TabsContent className="mt-4 space-y-4" value="services">
					<div className="flex justify-end">
						<Dialog
							onOpenChange={(open) => {
								setServiceDialogOpen(open);
								if (!open) resetServiceForm();
							}}
							open={serviceDialogOpen}
						>
							<DialogTrigger
								render={
									<Button className="gap-2">
										<IconPlus className="h-4 w-4" />
										Add Service
									</Button>
								}
							/>
							<DialogContent className="max-w-lg">
								<form
									onSubmit={(e) => {
										e.preventDefault();
										setServiceDialogOpen(false);
										resetServiceForm();
									}}
								>
									<DialogHeader>
										<DialogTitle>
											{editingService ? "Edit Service" : "Add Service"}
										</DialogTitle>
										<DialogDescription>
											Configure imaging service details
										</DialogDescription>
									</DialogHeader>

									<div className="space-y-4 py-4">
										<div className="space-y-2">
											<Label>Service Name</Label>
											<Input
												onChange={(e) =>
													setServiceForm((prev) => ({
														...prev,
														name: e.target.value,
													}))
												}
												placeholder="e.g., X-Ray Chest PA View"
												value={serviceForm.name}
											/>
										</div>

										<div className="grid gap-4 sm:grid-cols-2">
											<div className="space-y-2">
												<Label>Modality</Label>
												<Select
													onValueChange={(value) =>
														setServiceForm((prev) => ({
															...prev,
															modality: value ?? "xray",
														}))
													}
													value={serviceForm.modality}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{MODALITIES.map((m) => (
															<SelectItem key={m.id} value={m.id}>
																{m.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label>CPT Code</Label>
												<Input
													onChange={(e) =>
														setServiceForm((prev) => ({
															...prev,
															code: e.target.value,
														}))
													}
													placeholder="e.g., CPT-71046"
													value={serviceForm.code}
												/>
											</div>
										</div>

										<div className="grid gap-4 sm:grid-cols-2">
											<div className="space-y-2">
												<Label>Duration (minutes)</Label>
												<Input
													onChange={(e) =>
														setServiceForm((prev) => ({
															...prev,
															defaultDuration: Number(e.target.value),
														}))
													}
													type="number"
													value={serviceForm.defaultDuration}
												/>
											</div>
											<div className="flex items-center gap-2 pt-6">
												<Switch
													checked={serviceForm.isActive}
													onCheckedChange={(checked) =>
														setServiceForm((prev) => ({
															...prev,
															isActive: checked,
														}))
													}
												/>
												<Label>Active</Label>
											</div>
										</div>

										<div className="space-y-2">
											<Label>Preparation Instructions</Label>
											<Input
												onChange={(e) =>
													setServiceForm((prev) => ({
														...prev,
														preparationInstructions: e.target.value,
													}))
												}
												placeholder="Patient preparation requirements..."
												value={serviceForm.preparationInstructions}
											/>
										</div>
									</div>

									<DialogFooter showCloseButton={false}>
										<DialogClose
											render={
												<Button type="button" variant="outline">
													Cancel
												</Button>
											}
										/>
										<Button type="submit">
											{editingService ? "Update" : "Create"}
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
					</div>

					<Card>
						<CardContent className="p-0">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Service Name</TableHead>
										<TableHead>Modality</TableHead>
										<TableHead>Code</TableHead>
										<TableHead>Duration</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{MOCK_SERVICES.map((service) => (
										<TableRow key={service.id}>
											<TableCell className="font-medium">
												{service.name}
											</TableCell>
											<TableCell>
												<Badge variant="secondary">
													{
														MODALITIES.find((m) => m.id === service.modality)
															?.label
													}
												</Badge>
											</TableCell>
											<TableCell>{service.code}</TableCell>
											<TableCell>{service.defaultDuration} min</TableCell>
											<TableCell>
												<Badge
													className={
														service.isActive
															? "bg-green-100 text-green-800"
															: "bg-gray-100 text-gray-800"
													}
												>
													{service.isActive ? "Active" : "Inactive"}
												</Badge>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Button
														onClick={() => handleEditService(service)}
														size="sm"
														variant="ghost"
													>
														<IconPencil className="h-4 w-4" />
													</Button>
													<Button size="sm" variant="ghost">
														<IconTrash className="h-4 w-4 text-destructive" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent className="mt-4 space-y-4" value="facilities">
					<div className="flex justify-end">
						<Dialog
							onOpenChange={(open) => {
								setFacilityDialogOpen(open);
								if (!open) resetFacilityForm();
							}}
							open={facilityDialogOpen}
						>
							<DialogTrigger
								render={
									<Button className="gap-2">
										<IconPlus className="h-4 w-4" />
										Add Facility
									</Button>
								}
							/>
							<DialogContent className="max-w-lg">
								<form
									onSubmit={(e) => {
										e.preventDefault();
										setFacilityDialogOpen(false);
										resetFacilityForm();
									}}
								>
									<DialogHeader>
										<DialogTitle>
											{editingFacility ? "Edit Facility" : "Add Facility"}
										</DialogTitle>
										<DialogDescription>
											Configure imaging equipment/room
										</DialogDescription>
									</DialogHeader>

									<div className="space-y-4 py-4">
										<div className="space-y-2">
											<Label>Facility Name</Label>
											<Input
												onChange={(e) =>
													setFacilityForm((prev) => ({
														...prev,
														name: e.target.value,
													}))
												}
												placeholder="e.g., CT Scanner"
												value={facilityForm.name}
											/>
										</div>

										<div className="grid gap-4 sm:grid-cols-2">
											<div className="space-y-2">
												<Label>Modality</Label>
												<Select
													onValueChange={(value) =>
														setFacilityForm((prev) => ({
															...prev,
															modality: value ?? "xray",
														}))
													}
													value={facilityForm.modality}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{MODALITIES.map((m) => (
															<SelectItem key={m.id} value={m.id}>
																{m.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label>Room Number</Label>
												<Input
													onChange={(e) =>
														setFacilityForm((prev) => ({
															...prev,
															roomNumber: e.target.value,
														}))
													}
													placeholder="e.g., RAD-201"
													value={facilityForm.roomNumber}
												/>
											</div>
										</div>

										<div className="space-y-2">
											<Label>Status</Label>
											<Select
												onValueChange={(value) =>
													setFacilityForm((prev) => ({
														...prev,
														status: (value ?? "available") as
															| "available"
															| "maintenance",
													}))
												}
												value={facilityForm.status}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="available">Available</SelectItem>
													<SelectItem value="maintenance">
														Under Maintenance
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>

									<DialogFooter showCloseButton={false}>
										<DialogClose
											render={
												<Button type="button" variant="outline">
													Cancel
												</Button>
											}
										/>
										<Button type="submit">
											{editingFacility ? "Update" : "Create"}
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						{MOCK_FACILITIES.map((facility) => (
							<Card key={facility.id}>
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<div>
											<CardTitle className="text-base">
												{facility.name}
											</CardTitle>
											<CardDescription>
												Room {facility.roomNumber}
											</CardDescription>
										</div>
										<Badge
											className={
												facility.status === "available"
													? "bg-green-100 text-green-800"
													: "bg-amber-100 text-amber-800"
											}
										>
											{facility.status === "available"
												? "Available"
												: "Maintenance"}
										</Badge>
									</div>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="flex items-center gap-2">
										<Badge variant="secondary">
											{
												MODALITIES.find((m) => m.id === facility.modality)
													?.label
											}
										</Badge>
									</div>
									<div className="text-muted-foreground text-sm">
										<p className="font-medium">Operating Hours:</p>
										<div className="mt-1 grid grid-cols-7 gap-1 text-xs">
											{DAYS.map((day, idx) => {
												const hours = facility.operatingHours.find(
													(h) => h.dayOfWeek === idx,
												);
												return (
													<div
														className={cn(
															"rounded p-1 text-center",
															hours
																? "bg-primary/10 text-primary"
																: "bg-muted text-muted-foreground",
														)}
														key={`${facility.id}-${day}`}
													>
														<div className="font-medium">{day}</div>
														{hours && (
															<div className="text-[10px]">
																{hours.startTime.slice(0, 5)}
															</div>
														)}
													</div>
												);
											})}
										</div>
									</div>
									<div className="flex justify-end gap-2 pt-2">
										<Button
											onClick={() => handleEditFacility(facility)}
											size="sm"
											variant="ghost"
										>
											<IconPencil className="h-4 w-4" />
										</Button>
										<Button size="sm" variant="ghost">
											<IconTrash className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent className="mt-4" value="pricing">
					<Card>
						<CardHeader>
							<CardTitle>Service Pricing</CardTitle>
							<CardDescription>
								Configure pricing for standard, urgent, and emergency
								appointments
							</CardDescription>
						</CardHeader>
						<CardContent className="p-0">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Service</TableHead>
										<TableHead className="text-right">Standard ($)</TableHead>
										<TableHead className="text-right">Urgent ($)</TableHead>
										<TableHead className="text-right">Emergency ($)</TableHead>
										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{MOCK_PRICING.map((pricing) => {
										const edits = pricingEdits[pricing.serviceId] || pricing;
										return (
											<TableRow key={pricing.serviceId}>
												<TableCell className="font-medium">
													{pricing.serviceName}
												</TableCell>
												<TableCell className="text-right">
													<Input
														className="ml-auto w-24 text-right"
														onChange={(e) =>
															setPricingEdits((prev) => ({
																...prev,
																[pricing.serviceId]: {
																	...edits,
																	standard: Number(e.target.value),
																},
															}))
														}
														type="number"
														value={edits.standard}
													/>
												</TableCell>
												<TableCell className="text-right">
													<Input
														className="ml-auto w-24 text-right"
														onChange={(e) =>
															setPricingEdits((prev) => ({
																...prev,
																[pricing.serviceId]: {
																	...edits,
																	urgent: Number(e.target.value),
																},
															}))
														}
														type="number"
														value={edits.urgent}
													/>
												</TableCell>
												<TableCell className="text-right">
													<Input
														className="ml-auto w-24 text-right"
														onChange={(e) =>
															setPricingEdits((prev) => ({
																...prev,
																[pricing.serviceId]: {
																	...edits,
																	emergency: Number(e.target.value),
																},
															}))
														}
														type="number"
														value={edits.emergency}
													/>
												</TableCell>
												<TableCell>
													<Button size="sm" variant="outline">
														Save
													</Button>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent className="mt-4" value="hours">
					<Card>
						<CardHeader>
							<CardTitle>Schedule Configuration</CardTitle>
							<CardDescription>
								Configure default slot settings and lead time for appointments
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
								<div className="space-y-2">
									<Label>Default Slot Duration</Label>
									<div className="flex items-center gap-2">
										<Input type="number" value={15} />
										<span className="text-muted-foreground text-sm">
											minutes
										</span>
									</div>
								</div>
								<div className="space-y-2">
									<Label>Buffer Time Between Slots</Label>
									<div className="flex items-center gap-2">
										<Input type="number" value={5} />
										<span className="text-muted-foreground text-sm">
											minutes
										</span>
									</div>
								</div>
								<div className="space-y-2">
									<Label>Max Appointments per Slot</Label>
									<Input placeholder="Unlimited" type="number" />
								</div>
								<div className="space-y-2">
									<Label>Lead Time for Booking</Label>
									<div className="flex items-center gap-2">
										<Input type="number" value={30} />
										<span className="text-muted-foreground text-sm">
											days ahead
										</span>
									</div>
								</div>
							</div>

							<div className="flex justify-end">
								<Button>Save Configuration</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
