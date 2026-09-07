import { db } from "#/lib/db/server";
import { cdcSink, cdcStaff } from "#/schemas/db";

interface AuditLogEntry {
	field: string;
	newValue: unknown;
	oldValue: unknown;
}

/**
 * Log audit trail entries for a staff record change.
 * Call this from within procedure handlers after performing the mutation.
 */
export async function logAuditTrail(params: {
	entries: AuditLogEntry[];
	operation: "DELETE" | "INSERT" | "UPDATE";
	sourceId: string;
	sourceTable: string;
	userId: string;
}) {
	const { entries, operation, sourceId, sourceTable, userId } = params;

	if (entries.length === 0) return;

	// Generate a unique ID for this transaction
	const mvccId = `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

	// Insert sink record
	const [sink] = await db
		.insert(cdcSink)
		.values({
			mvccId,
			operation,
			sourceId,
			sourceTable,
			userId,
		})
		.returning();

	// Insert field-level changes
	const staffEntries = entries.map((entry) => ({
		field: entry.field,
		newValue: entry.newValue != null ? String(entry.newValue) : null,
		oldValue: entry.oldValue != null ? String(entry.oldValue) : null,
		sinkId: sink.id,
	}));

	await db.insert(cdcStaff).values(staffEntries);
}

/**
 * Diff two objects and return changed fields as audit entries.
 */
export function diffFields(
	oldRecord: Record<string, unknown>,
	newRecord: Record<string, unknown>,
	fieldsToTrack: string[],
): AuditLogEntry[] {
	const entries: AuditLogEntry[] = [];

	for (const field of fieldsToTrack) {
		const oldVal = oldRecord[field];
		const newVal = newRecord[field];

		// Normalize for comparison
		const oldStr = oldVal != null ? String(oldVal) : null;
		const newStr = newVal != null ? String(newVal) : null;

		if (oldStr !== newStr) {
			entries.push({
				field,
				newValue: newVal,
				oldValue: oldVal,
			});
		}
	}

	return entries;
}
