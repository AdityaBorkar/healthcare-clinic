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
import { authMiddleware } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const saveCaseSheet = authMiddleware
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

export const repertorize = authMiddleware
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

export const dualCode = authMiddleware
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

export const bookNadi = authMiddleware
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

export const scheduleTherapy = authMiddleware
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

export const recordSitting = authMiddleware
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

export const sellPackage = authMiddleware
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

export const pauseExtendPackage = authMiddleware
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

export const issueDiet = authMiddleware
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

export const enrollYoga = authMiddleware
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

export const createYogaBatch = authMiddleware
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

export const saveFollowUpGrid = authMiddleware
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

export const listFollowUpGrid = authMiddleware
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

export const markYogaAttendance = authMiddleware
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

export const prescribeAyush = authMiddleware
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

export const recordPackageOutcome = authMiddleware
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
