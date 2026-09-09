import { pm } from "../../src/aspen/server";

// Every table $prepareInfra() must create in the control-plane database:
// core platform schemas + management module schemas. If any are missing
// after the push, the prepare failed and we must exit non-zero instead of
// reporting success.
const REQUIRED_TABLES = [
	"account",
	"apikey",
	"audit_log",
	"file_metadata",
	"invitation",
	"kv_store",
	"logs",
	"managed_organization",
	"member",
	"organization",
	"passkey",
	"service_provider",
	"service_provider_user",
	"session",
	"tenant",
	"two_factor",
	"user",
	"verification",
	"workflow_runs",
	"workflow_steps",
];

try {
	await pm.$prepareInfra();

	const rows = (await pm.db.pool.unsafe(
		"SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
	)) as Array<{ table_name: string }>;
	const existing = new Set(rows.map((row) => row.table_name));
	const missing = REQUIRED_TABLES.filter((table) => !existing.has(table));

	console.log(
		`Control-plane tables (${existing.size}): ${[...existing].sort().join(", ") || "(none)"}`,
	);

	if (missing.length > 0) {
		throw new Error(
			`Infra prepare incomplete — missing tables: ${missing.join(", ")}`,
		);
	}

	console.log("Infra prepared successfully");
} catch (err) {
	console.error(err);
	process.exitCode = 1;
} finally {
	await pm.$cleanup().catch(() => {});
}
