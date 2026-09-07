import { createFileRoute, redirect } from "@tanstack/react-router";

import type { FormType } from "#/lib/actions/forms";
import { FORM_TYPES } from "#/lib/actions/forms";
import { client } from "#/lib/rpc";

export const Route = createFileRoute("/(app)/drafts/$draftId")({
	beforeLoad: async ({ params }) => {
		const draft = await client.drafts.get({ id: Number(params.draftId) });
		const formType = FORM_TYPES[draft.formType as FormType];
		if (!formType) {
			throw redirect({
				to: "/drafts",
			});
		}
		throw redirect({
			search: { draftId: draft.id },
			to: formType.route,
		});
	},
	head: () => ({
		meta: [{ title: "Draft (Shaun)" }],
	}),
});
