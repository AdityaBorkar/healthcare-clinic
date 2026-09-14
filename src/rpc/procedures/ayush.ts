// NOTE: `pm` is lazily imported inside handlers (not statically) because the
// clinic track contract forbids top-level pm/router imports in procedures.
import {
	AyushCaseSheetInputSchema,
	AyushDiagnosisInputSchema,
	AyushPrescriptionInputSchema,
	DietPlanInputSchema,
	FollowUpGridInputSchema,
	FollowUpGridListSchema,
	NadiBookingInputSchema,
	PackageOutcomeInputSchema,
	PackagePauseExtendInputSchema,
	RepertorizationInputSchema,
	TherapyPackageInputSchema,
	TherapySittingInputSchema,
	YogaAttendanceInputSchema,
	YogaBatchInputSchema,
	YogaEnrollmentInputSchema,
} from "#/schemas/ayush";
import { authed } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const saveCaseSheet = authed
	.input(AyushCaseSheetInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.ayush.saveCaseSheet.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const repertorize = authed
	.input(RepertorizationInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.ayush.repertorize.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const dualCode = authed
	.input(AyushDiagnosisInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.ayush.dualCode.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const bookNadi = authed
	.input(NadiBookingInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.ayush.bookNadi.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const scheduleTherapy = authed
	.input(TherapySittingInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.ayush.scheduleTherapy.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const recordSitting = authed
	.input(TherapySittingInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.ayush.recordSitting.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const sellPackage = authed
	.input(TherapyPackageInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.ayush.sellPackage.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const pauseExtendPackage = authed
	.input(PackagePauseExtendInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.ayush.pauseExtendPackage.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const issueDiet = authed
	.input(DietPlanInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.ayush.issueDiet.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const enrollYoga = authed
	.input(YogaEnrollmentInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.ayush.enrollYoga.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const createYogaBatch = authed
	.input(YogaBatchInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.ayush.createYogaBatch.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const saveFollowUpGrid = authed
	.input(FollowUpGridInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.ayush.saveFollowUpGrid.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const listFollowUpGrid = authed
	.input(FollowUpGridListSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.ayush.listFollowUpGrid.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const markYogaAttendance = authed
	.input(YogaAttendanceInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.ayush.markYogaAttendance.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const prescribeAyush = authed
	.input(AyushPrescriptionInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.ayush.prescribe.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const recordPackageOutcome = authed
	.input(PackageOutcomeInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.ayush.recordPackageOutcome.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});
