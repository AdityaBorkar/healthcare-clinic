import { IconPlus } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/(app)/(erp)/vendors/")({
	component: VendorsIndex,
	head: () => ({
		meta: [{ title: "Vendors (Shaun)" }],
	}),
});

function VendorsIndex() {
	return (
		<div className="container mx-auto max-w-4xl p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl">Vendors</h1>
					<p className="text-muted-foreground">
						Manage vendors, suppliers, insurers, and business partners
					</p>
				</div>
				<Link to="/vendors/new">
					<Button className="gap-2">
						<IconPlus className="h-4 w-4" />
						Create Vendor
					</Button>
				</Link>
			</div>
		</div>
	);
}
