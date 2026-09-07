import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as v from "valibot";

import PractitionerForm from "./-form";

export const Route = createFileRoute("/(app)/(erp)/practitioners/new")({
	component: NewPractitionerPage,
	head: () => ({
		meta: [{ title: "New Practitioner (Shaun)" }],
	}),
	validateSearch: v.object({ draftId: v.optional(v.number()) }),
});

function NewPractitionerPage() {
	const { draftId } = Route.useSearch();
	const navigate = useNavigate();

	return (
		<PractitionerForm
			draftId={draftId}
			onCancel={() => navigate({ to: "/practitioners" })}
			onSuccess={() => navigate({ to: "/practitioners" })}
		/>
	);
}
