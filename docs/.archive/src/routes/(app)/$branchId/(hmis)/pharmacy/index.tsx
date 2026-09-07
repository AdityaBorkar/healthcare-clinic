import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/$branchId/(hmis)/pharmacy/")({
	component: PharmacyComponent,
	head: () => ({
		meta: [{ title: "Pharmacy (Shaun)" }],
	}),
});

function PharmacyComponent() {
	return (
		<div className="p-6">
			<h1 className="font-bold text-2xl">Pharmacy</h1>
			<p className="text-muted-foreground">
				Drug inventory, prescriptions, and dispensing.
			</p>
		</div>
	);
}
