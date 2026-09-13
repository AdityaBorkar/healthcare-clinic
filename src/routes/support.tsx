import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Clock, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/support")({
	component: SupportPage,
	loader: async () => {
		try {
			const result = await orpc.organizations.bySubdomain();
			return {
				organization: result.organization
					? {
							logo: result.organization.logo,
							name: result.organization.name,
						}
					: null,
			};
		} catch {
			return { organization: null };
		}
	},
});

const AGENCY = {
	address: "123 Clinic Street, Medical District, City — 400001",
	email: "support@clinic.local",
	hours: "Monday – Saturday, 9:00 AM – 6:00 PM",
	name: "Healthcare Clinic Agency",
	phone: "+1 (555) 010-2030",
} as const;

function SupportPage() {
	const { organization } = Route.useLoaderData();
	const displayName = organization?.name ?? AGENCY.name;

	return (
		<main className="flex min-h-svh items-center justify-center bg-stone-canvas px-4 py-12 font-sans ">
			<div className="w-full max-w-md">
				<div className="mb-6 flex flex-col items-center text-center">
					{organization?.logo ? (
						<img
							alt={`${displayName} logo`}
							className="size-10 rounded-full object-cover"
							src={organization.logo}
						/>
					) : (
						<span className="flex size-10 items-center justify-center rounded-full bg-ink-black text-white">
							<Building2 className="size-5" />
						</span>
					)}
					<h1 className="mt-4  text-2xl font-medium  ">{displayName}</h1>
					<p className="mt-2 max-w-sm text-sm text-warm-gray">
						Need an account or help signing in? Reach out to the agency using
						the details below.
					</p>
				</div>

				<Card className="shadow-shadow-md">
					<CardHeader>
						<CardTitle>Contact Support</CardTitle>
						<p className="text-sm text-warm-gray">
							For sign-up requests and sign-in help.
						</p>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-start gap-3">
							<Phone className="mt-0.5 size-4 shrink-0 text-warm-gray" />
							<div>
								<p className="text-xs text-warm-gray">Phone</p>
								<a
									className="text-sm font-medium  hover:text-cyan-edge hover:underline"
									href={`tel:${AGENCY.phone}`}
								>
									{AGENCY.phone}
								</a>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<Mail className="mt-0.5 size-4 shrink-0 text-warm-gray" />
							<div>
								<p className="text-xs text-warm-gray">Email</p>
								<a
									className="text-sm font-medium  hover:text-cyan-edge hover:underline"
									href={`mailto:${AGENCY.email}`}
								>
									{AGENCY.email}
								</a>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<MapPin className="mt-0.5 size-4 shrink-0 text-warm-gray" />
							<div>
								<p className="text-xs text-warm-gray">Address</p>
								<p className="text-sm font-medium ">{AGENCY.address}</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<Clock className="mt-0.5 size-4 shrink-0 text-warm-gray" />
							<div>
								<p className="text-xs text-warm-gray">Working hours</p>
								<p className="text-sm font-medium ">{AGENCY.hours}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Button
					className="mt-6 w-full"
					nativeButton={false}
					render={<Link to="/" />}
					size="lg"
					variant="outline"
				>
					Back to sign-in
				</Button>
			</div>
		</main>
	);
}
