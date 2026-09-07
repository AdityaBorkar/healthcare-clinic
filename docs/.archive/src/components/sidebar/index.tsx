import {
	IconBed,
	IconBuildingCog,
	IconBuildingStore,
	IconBuildingWarehouse,
	IconBulb,
	IconCalendar,
	IconCash,
	IconCircleDashedCheck,
	IconCoinRupee,
	IconDashboard,
	IconDeviceDesktop,
	IconDeviceFloppy,
	IconFileArrowLeft,
	IconFileArrowRight,
	IconFileText,
	IconFlask,
	IconHeartHandshake,
	IconHeartRateMonitor,
	IconHome,
	IconLayoutGrid,
	IconPill,
	IconReport,
	IconSalad,
	IconSearch,
	IconShield,
	IconShieldCheckered,
	IconShieldLock,
	IconStethoscope,
	IconUrgent,
	IconUserHeart,
	IconUserScan,
	type TablerIcon,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
	Link,
	useNavigate,
	useParams,
	useRouter,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "#/components/ui/select";
import { client } from "#/lib/rpc";
import { getRouter } from "#/router";
import { Route } from "#/routes/(app)/route";

// import ThemeToggle from "../theme/toggle";

export type SidebarItem =
	| {
			label: string;
	  }
	| {
			label: string;
			to: string;
			icon: TablerIcon;
	  };

export default function Sidebar() {
	const router = useRouter();
	const navigate = useNavigate();
	const params = useParams({ strict: false });
	const { user } = Route.useRouteContext();
	const { data } = useQuery({
		queryFn: () => client.branches.listUser(),
		queryKey: ["listUserBranches"],
	});
	const companyName = data?.company?.name ?? "";
	const branchList = data?.branches ?? [];

	const [branchId, setBranchId] = useState(
		typeof window === "undefined"
			? ""
			: window?.localStorage?.getItem("branchId"),
	);

	useEffect(() => {
		if (!branchId) {
			const firstBranchId = params.branchId ?? String(branchList[0]?.id);
			setBranchId(firstBranchId);
			return;
		}
		window.localStorage.setItem("branchId", branchId);
	}, [branchId, branchList, params.branchId]);

	function handleValueChange(value: string | null) {
		if (!value) return;

		setBranchId(value);
		const params = router.state.matches.at(-1)?.params ?? { branchId: null };
		// @ts-expect-error
		if (params?.branchId) {
			const path = getRouter().latestLocation.pathname;
			navigate({
				params: { branchId: value },
				replace: false,
				to: `/$branchId/${path.split("/").slice(2).join("/")}`,
			});
		}
	}

	useEffect(() => {
		if (data?.company?.id) {
			localStorage.setItem("companyId", String(data.company.id));
		}
	}, [data]);

	const items = [
		{ label: "Personal" },
		{
			icon: IconDashboard,
			label: "Dashboard",
			to: `/dashboard`,
		},
		{ icon: IconDeviceFloppy, label: "Drafts", to: "/drafts" },
		{ label: "Patient Management" },
		{
			icon: IconUrgent,
			label: "Emergency",
			to: `/${branchId}/emergency`,
		},
		{
			icon: IconLayoutGrid,
			label: "OPD Dashboard",
			to: `/${branchId}/opd-dashboard`,
		},
		{
			icon: IconCalendar,
			label: "Appointments",
			to: `/${branchId}/appointments`,
		},
		{
			icon: IconLayoutGrid,
			label: "IPD Dashboard",
			to: `/${branchId}/ipd-dashboard`,
		},
		{ icon: IconUserHeart, label: "Nursing", to: `/${branchId}/nursing` },
		{
			icon: IconReport,
			label: "Medical Records",
			to: `/${branchId}/emr`,
		},
		{ label: "Hospital Management" },
		{ icon: IconBed, label: "Beds", to: `/${branchId}/beds` },
		{ icon: IconBulb, label: "OT", to: `/${branchId}/ot` },
		{ icon: IconFlask, label: "Lab", to: `/${branchId}/lab` },
		{
			icon: IconDeviceDesktop,
			label: "Radiology",
			to: `/${branchId}/radiology`,
		},
		{ icon: IconPill, label: "Pharmacy", to: `/${branchId}/pharmacy` },
		{ icon: IconSalad, label: "Cafeteria", to: `/${branchId}/cafeteria` },
		{
			icon: IconBuildingWarehouse,
			label: "Inventory",
			to: `/${branchId}/inventory`,
		},
		{ icon: IconShieldLock, label: "Security", to: `/${branchId}/security` },
		{ label: "ERP Management" },
		{ icon: IconBuildingCog, label: "Branches", to: "/branches" },
		{ icon: IconUserScan, label: "HR Staff", to: "/hr/staff" },
		{
			icon: IconStethoscope,
			label: "Practitioners",
			to: "/practitioners",
		},
		{ icon: IconUserHeart, label: "Patients", to: "/patients" },
		{
			icon: IconHeartRateMonitor,
			label: "Facilities",
			to: "/facilities",
		},
		{ icon: IconHeartHandshake, label: "Services", to: "/services" },
		{ icon: IconCoinRupee, label: "Pricelists", to: "/pricelists" },
		{ icon: IconBuildingStore, label: "Vendors", to: "/vendors" },
		{ icon: IconCircleDashedCheck, label: "SOP & SLA", to: `/sop-sla` },
		{ icon: IconFileText, label: "Reports", to: `/reports` },
		{ label: "Accounting" },
		{
			icon: IconFileArrowRight,
			label: "Sales",
			to: `/${branchId}/sales`,
		},
		{
			icon: IconFileArrowLeft,
			label: "Purchases",
			to: `/${branchId}/purchases`,
		},
		{
			icon: IconCash,
			label: "Accounting",
			to: `/${branchId}/accounting`,
		},
	];

	return (
		<aside className="flex h-full w-64 select-none flex-col divide-y divide-sidebar-border border-sidebar-border border-r bg-sidebar text-sidebar-foreground">
			<div className="border-b px-4 py-2">
				<Select onValueChange={handleValueChange} value={branchId || ""}>
					<SelectTrigger className="h-9 w-full gap-1.5 border-transparent bg-transparent px-2 font-medium text-xs hover:bg-accent data-[state=open]:bg-accent sm:text-sm">
						<IconHome className="mr-1 size-4" />
						<div>
							{
								branchList.find((branch) => String(branch.id) === branchId)
									?.name
							}
						</div>
					</SelectTrigger>
					<SelectContent>
						<div className="px-2 py-1.5 font-semibold text-muted-foreground text-xs">
							{companyName}
						</div>
						{branchList.map((branch: { id: number; name: string }) => {
							return (
								<SelectItem key={branch.id} value={branch.id.toString()}>
									<div className="flex flex-col">
										<span>{branch.name}</span>
									</div>
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>
				<div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2.5 text-muted-foreground">
					<IconSearch className="size-4" stroke={1.5} />
					<span className="text-sm">Search</span>
					<kbd className="ml-auto rounded bg-background px-1.5 py-0.5 font-medium text-xs">
						/
					</kbd>
				</div>
			</div>
			<div className="grow space-y-0.5 overflow-y-auto px-2 py-2">
				{items.map((item) =>
					item.icon ? (
						<Link
							activeProps={{
								className:
									"bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent",
							}}
							className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-muted-foreground text-sm transition-all hover:bg-sidebar-accent/80 hover:text-sidebar-foreground"
							key={item.to}
							to={item.to}
						>
							<item.icon className="size-5" stroke={1.5} />
							{item.label}
						</Link>
					) : (
						<h3
							className="mt-8 mb-2 ml-3.5 font-semibold text-muted-foreground/60 text-xs uppercase tracking-wider"
							key={item.label}
						>
							{item.label}
						</h3>
					),
				)}
			</div>
			<div>
				<button
					className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sidebar-accent"
					type="button"
				>
					<img
						alt={user.name}
						className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-200 font-semibold text-sm text-white"
						src={user.image || ""}
					/>
					<div className="grow text-left">
						<div className="font-semibold text-sm">{user.name}</div>
						<div className="text-xs">{user.email}</div>
					</div>
					{/*<IconChevronDown className="h-4 w-4" stroke={1.5} />*/}
				</button>
				{/*
              <div className="mx-auto mt-auto py-4">
              <ThemeToggle />
            </div>
            */}
			</div>
		</aside>
	);
}
