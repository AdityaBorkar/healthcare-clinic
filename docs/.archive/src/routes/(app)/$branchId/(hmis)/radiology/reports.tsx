import {
	IconCheck,
	IconClock,
	IconDownload,
	IconEye,
	IconFileText,
	IconPhoto,
	IconRefresh,
	IconUpload,
	IconX,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { cn } from "#/lib/utils";

export const Route = createFileRoute(
	"/(app)/$branchId/(hmis)/radiology/reports",
)({
	component: RadiologyReports,
	head: () => ({
		meta: [{ title: "Radiology Reports (Shaun)" }],
	}),
});

const MOCK_PENDING_REPORTS = [
	{
		appointmentId: "apt-1",
		completedAt: "2024-01-15T09:30:00",
		date: "2024-01-15",
		id: "1",
		patientMrn: "MRN001",
		patientName: "John Smith",
		patientType: "opd" as const,
		priority: "routine" as const,
		serviceName: "CT Scan - Abdomen",
		time: "09:00",
	},
	{
		appointmentId: "apt-2",
		completedAt: "2024-01-15T10:15:00",
		date: "2024-01-15",
		id: "2",
		patientMrn: "MRN002",
		patientName: "Mary Johnson",
		patientType: "ipd" as const,
		priority: "urgent" as const,
		serviceName: "X-Ray Chest PA View",
		time: "10:00",
	},
	{
		appointmentId: "apt-3",
		completedAt: "2024-01-15T14:30:00",
		date: "2024-01-15",
		id: "3",
		patientMrn: "MRN004",
		patientName: "Sarah Wilson",
		patientType: "opd" as const,
		priority: "stat" as const,
		serviceName: "Ultrasound - Abdomen",
		time: "14:00",
	},
	{
		appointmentId: "apt-5",
		completedAt: "2024-01-15T15:45:00",
		date: "2024-01-15",
		id: "4",
		patientMrn: "MRN005",
		patientName: "Michael Brown",
		patientType: "ipd" as const,
		priority: "routine" as const,
		serviceName: "X-Ray Chest PA View",
		time: "15:30",
	},
];

const MOCK_UPLOADED_REPORTS = [
	{
		appointmentDate: "2024-01-14",
		appointmentId: "apt-4",
		appointmentTime: "11:00",
		fileName: "mri_brain_robert_davis.pdf",
		fileSize: "2.4 MB",
		id: "r-1",
		patientMrn: "MRN003",
		patientName: "Robert Davis",
		patientType: "opd" as const,
		serviceName: "MRI - Brain",
		uploadedAt: "2024-01-14T12:30:00",
		uploadedBy: "Dr. Sarah Chen",
	},
	{
		appointmentDate: "2024-01-14",
		appointmentId: "apt-6",
		appointmentTime: "09:00",
		fileName: "xray_chest_emily_chen.pdf",
		fileSize: "1.2 MB",
		id: "r-2",
		patientMrn: "MRN006",
		patientName: "Emily Chen",
		patientType: "opd" as const,
		serviceName: "X-Ray Chest PA View",
		uploadedAt: "2024-01-14T09:20:00",
		uploadedBy: "Dr. James Wilson",
	},
	{
		appointmentDate: "2024-01-13",
		appointmentId: "apt-7",
		appointmentTime: "14:00",
		fileName: "ct_abd_david_lee.pdf",
		fileSize: "3.1 MB",
		id: "r-3",
		patientMrn: "MRN007",
		patientName: "David Lee",
		patientType: "ipd" as const,
		serviceName: "CT Scan - Abdomen",
		uploadedAt: "2024-01-13T15:30:00",
		uploadedBy: "Dr. Sarah Chen",
	},
];

function RadiologyReports() {
	const [activeTab, setActiveTab] = useState("pending");
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
	const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
	const [selectedReport, setSelectedReport] = useState<
		(typeof MOCK_UPLOADED_REPORTS)[0] | null
	>(null);
	const [selectedPendingReport, setSelectedPendingReport] = useState<
		(typeof MOCK_PENDING_REPORTS)[0] | null
	>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [priorityFilter, setPriorityFilter] = useState("all");
	const [isDragging, setIsDragging] = useState(false);
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const filteredPendingReports = MOCK_PENDING_REPORTS.filter((report) => {
		const matchesSearch =
			report.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			report.patientMrn.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesPriority =
			priorityFilter === "all" || report.priority === priorityFilter;
		return matchesSearch && matchesPriority;
	});

	const filteredUploadedReports = MOCK_UPLOADED_REPORTS.filter((report) => {
		const matchesSearch =
			report.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			report.patientMrn.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesSearch;
	});

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files[0];
		if (
			file &&
			(file.type === "application/pdf" || file.type.startsWith("image/"))
		) {
			setUploadedFile(file);
		}
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setUploadedFile(file);
		}
	};

	const handleUpload = () => {
		if (uploadedFile && selectedPendingReport) {
			setUploadDialogOpen(false);
			setUploadedFile(null);
			setSelectedPendingReport(null);
		}
	};

	const openUploadDialog = (report: (typeof MOCK_PENDING_REPORTS)[0]) => {
		setSelectedPendingReport(report);
		setUploadDialogOpen(true);
	};

	const openPreviewDialog = (report: (typeof MOCK_UPLOADED_REPORTS)[0]) => {
		setSelectedReport(report);
		setPreviewDialogOpen(true);
	};

	const getPriorityBadge = (priority: string) => {
		switch (priority) {
			case "stat":
				return <Badge className="bg-red-100 text-red-800">STAT</Badge>;
			case "urgent":
				return <Badge className="bg-amber-100 text-amber-800">URGENT</Badge>;
			default:
				return <Badge variant="secondary">Routine</Badge>;
		}
	};

	const formatDateTime = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleString("en-US", {
			dateStyle: "medium",
			timeStyle: "short",
		});
	};

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl">Reports Management</h1>
					<p className="text-muted-foreground">
						Upload and manage radiology reports
					</p>
				</div>
			</div>

			<div className="flex items-center gap-4">
				<div className="relative max-w-md flex-1">
					<Input
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search by patient name or MRN..."
						value={searchQuery}
					/>
				</div>
				<Select
					onValueChange={(value) => setPriorityFilter(value ?? "all")}
					value={priorityFilter}
				>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Priority" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Priorities</SelectItem>
						<SelectItem value="stat">STAT</SelectItem>
						<SelectItem value="urgent">Urgent</SelectItem>
						<SelectItem value="routine">Routine</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<Tabs
				className="flex flex-col"
				onValueChange={setActiveTab}
				value={activeTab}
			>
				<TabsList>
					<TabsTrigger className="gap-2" value="pending">
						<IconClock className="h-4 w-4" />
						Pending Upload
						<Badge className="ml-1" variant="secondary">
							{filteredPendingReports.length}
						</Badge>
					</TabsTrigger>
					<TabsTrigger className="gap-2" value="uploaded">
						<IconFileText className="h-4 w-4" />
						Uploaded Reports
						<Badge className="ml-1" variant="secondary">
							{filteredUploadedReports.length}
						</Badge>
					</TabsTrigger>
				</TabsList>

				<TabsContent className="mt-4 space-y-4" value="pending">
					{filteredPendingReports.length === 0 ? (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<IconCheck className="mb-4 h-12 w-12 text-green-500" />
								<p className="text-muted-foreground">No pending reports</p>
								<p className="text-muted-foreground text-sm">
									All completed studies have reports uploaded
								</p>
							</CardContent>
						</Card>
					) : (
						<div className="grid gap-4">
							{filteredPendingReports.map((report) => (
								<Card key={report.id}>
									<CardContent className="p-4">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-4">
												<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
													<IconFileText className="h-5 w-5 text-amber-600" />
												</div>
												<div>
													<div className="flex items-center gap-2">
														<p className="font-medium">{report.patientName}</p>
														<Badge
															className={
																report.patientType === "ipd"
																	? "bg-purple-100 text-purple-800"
																	: "bg-blue-100 text-blue-800"
															}
														>
															{report.patientType.toUpperCase()}
														</Badge>
														{getPriorityBadge(report.priority)}
													</div>
													<p className="text-muted-foreground text-sm">
														{report.serviceName} | {report.patientMrn}
													</p>
												</div>
											</div>
											<div className="flex items-center gap-4">
												<div className="text-right">
													<p className="font-medium text-sm">{report.date}</p>
													<p className="text-muted-foreground text-xs">
														Completed at{" "}
														{formatDateTime(report.completedAt).split(",")[1]}
													</p>
												</div>
												<Button
													className="gap-2"
													onClick={() => openUploadDialog(report)}
													size="sm"
												>
													<IconUpload className="h-4 w-4" />
													Upload Report
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</TabsContent>

				<TabsContent className="mt-4 space-y-4" value="uploaded">
					{filteredUploadedReports.length === 0 ? (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<IconFileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
								<p className="text-muted-foreground">No uploaded reports</p>
								<p className="text-muted-foreground text-sm">
									Uploaded reports will appear here
								</p>
							</CardContent>
						</Card>
					) : (
						<div className="grid gap-4">
							{filteredUploadedReports.map((report) => (
								<Card key={report.id}>
									<CardContent className="p-4">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-4">
												<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
													<IconFileText className="h-5 w-5 text-green-600" />
												</div>
												<div>
													<div className="flex items-center gap-2">
														<p className="font-medium">{report.patientName}</p>
														<Badge
															className={
																report.patientType === "ipd"
																	? "bg-purple-100 text-purple-800"
																	: "bg-blue-100 text-blue-800"
															}
														>
															{report.patientType.toUpperCase()}
														</Badge>
													</div>
													<p className="text-muted-foreground text-sm">
														{report.serviceName} | {report.patientMrn}
													</p>
													<p className="text-muted-foreground text-xs">
														Uploaded by {report.uploadedBy} on{" "}
														{formatDateTime(report.uploadedAt)}
													</p>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<div className="mr-4 text-right">
													<p className="font-medium text-sm">
														{report.fileName}
													</p>
													<p className="text-muted-foreground text-xs">
														{report.fileSize}
													</p>
												</div>
												<Button
													onClick={() => openPreviewDialog(report)}
													size="sm"
													variant="outline"
												>
													<IconEye className="mr-1 h-4 w-4" />
													View
												</Button>
												<Button size="sm" variant="outline">
													<IconDownload className="mr-1 h-4 w-4" />
													Download
												</Button>
												<Button size="sm" variant="ghost">
													<IconRefresh className="mr-1 h-4 w-4" />
													Replace
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>

			<Dialog
				onOpenChange={(open) => {
					setUploadDialogOpen(open);
					if (!open) {
						setUploadedFile(null);
						setSelectedPendingReport(null);
					}
				}}
				open={uploadDialogOpen}
			>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Upload Report</DialogTitle>
						<DialogDescription>
							Upload a scanned report for {selectedPendingReport?.patientName}
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						{selectedPendingReport ? (
							<div className="rounded-lg bg-muted p-3">
								<p className="text-sm">
									<span className="font-medium">
										{selectedPendingReport.serviceName}
									</span>
								</p>
								<p className="text-muted-foreground text-xs">
									Appointment: {selectedPendingReport.date} at{" "}
									{selectedPendingReport.time}
								</p>
							</div>
						) : null}

						<button
							className={cn(
								"relative w-full rounded-lg border-2 border-dashed p-8 text-center transition-colors",
								isDragging && "border-primary bg-primary/5",
								uploadedFile && "border-green-500 bg-green-50",
							)}
							onClick={() => !uploadedFile && fileInputRef.current?.click()}
							onDragLeave={handleDragLeave}
							onDragOver={handleDragOver}
							onDrop={handleDrop}
							type="button"
						>
							<input
								accept=".pdf,image/*"
								className="hidden"
								onChange={handleFileSelect}
								ref={fileInputRef}
								type="file"
							/>

							{uploadedFile ? (
								<div className="flex flex-col items-center gap-2">
									<IconCheck className="h-8 w-8 text-green-600" />
									<p className="font-medium">{uploadedFile.name}</p>
									<p className="text-muted-foreground text-sm">
										{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
									</p>
									<Button
										onClick={(e) => {
											e.stopPropagation();
											setUploadedFile(null);
										}}
										size="sm"
										type="button"
										variant="ghost"
									>
										<IconX className="mr-1 h-4 w-4" />
										Remove
									</Button>
								</div>
							) : (
								<div className="flex flex-col items-center gap-2">
									<IconUpload className="h-8 w-8 text-muted-foreground" />
									<p className="font-medium">
										Drop file here or click to browse
									</p>
									<p className="text-muted-foreground text-sm">
										PDF or Image files (max 10MB)
									</p>
								</div>
							)}
						</button>

						<div className="flex items-center gap-2 text-muted-foreground text-sm">
							<IconPhoto className="h-4 w-4" />
							<span>
								You can also scan documents directly using a connected scanner
							</span>
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
						<Button disabled={!uploadedFile} onClick={handleUpload}>
							Upload Report
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog onOpenChange={setPreviewDialogOpen} open={previewDialogOpen}>
				<DialogContent className="max-w-3xl">
					<DialogHeader>
						<DialogTitle>Report Preview</DialogTitle>
						<DialogDescription>
							{selectedReport?.patientName} - {selectedReport?.serviceName}
						</DialogDescription>
					</DialogHeader>

					{selectedReport && (
						<div className="space-y-4">
							<div className="flex aspect-[3/4] w-full items-center justify-center rounded-lg bg-muted">
								<div className="text-center">
									<IconFileText className="mx-auto mb-2 h-16 w-16 text-muted-foreground" />
									<p className="font-medium">{selectedReport.fileName}</p>
									<p className="text-muted-foreground text-sm">
										{selectedReport.fileSize}
									</p>
									<Button className="mt-4" variant="outline">
										<IconDownload className="mr-2 h-4 w-4" />
										Download to View
									</Button>
								</div>
							</div>

							<div className="rounded-lg bg-muted p-3 text-sm">
								<div className="grid grid-cols-2 gap-2">
									<div>
										<span className="text-muted-foreground">Patient:</span>{" "}
										<span className="font-medium">
											{selectedReport.patientName}
										</span>
									</div>
									<div>
										<span className="text-muted-foreground">MRN:</span>{" "}
										<span className="font-medium">
											{selectedReport.patientMrn}
										</span>
									</div>
									<div>
										<span className="text-muted-foreground">Service:</span>{" "}
										<span className="font-medium">
											{selectedReport.serviceName}
										</span>
									</div>
									<div>
										<span className="text-muted-foreground">Uploaded by:</span>{" "}
										<span className="font-medium">
											{selectedReport.uploadedBy}
										</span>
									</div>
								</div>
							</div>
						</div>
					)}

					<DialogFooter>
						<DialogClose render={<Button variant="outline">Close</Button>} />
						<Button>
							<IconDownload className="mr-2 h-4 w-4" />
							Download
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
