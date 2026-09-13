# 12 — Admin, HR, Reports, Compliance

## 1. Purpose
Give administrators one place to run the organization — people, branches, masters, prices, messages, reports, and regulatory evidence — so that every department works on governed data, every PHI touch is logged, and a new branch or pricelist goes live without code changes. Details for sub-masters live in specs 13–20; this file is the governing shell.

## 2. Ubiquitous Language

| Term | Definition | Example |
|---|---|---|
| Staff | Any employed/contracted worker | Nurse, housekeeping |
| Roster | Planned shift allocation per staff/facility | Night ward roster |
| Attendance | Actual presence captured per shift | Biometric 09:02 in |
| Leave hook | Leave request event exposed to payroll | 3-day sick leave |
| Payroll-hook-only | System emits payroll inputs, never computes pay | Export to Tally/payroll |
| Master | Governed reference data (facility/service/price/code) | CGHS rate card |
| Preset JSON | Shipped seed for facility categories | MRI/CT/X-ray rooms |
| Branch | Physical/semantic site under a company | City Road branch |
| Subdomain login | Branch-scoped access via URL (`<branch>.domain/login`) | `care.domain/login` |
| Data Explorer | Ad-hoc filtered view over operational data | "IPD dues > 30d" |
| ReportDef | Saved report definition with schedule/export | Daily collection |
| AuditLog | Immutable who-did-what-when record | Bill void by X |
| Consent archive | Retrievable store of signed consents | Surgery consent PDF |
| Map toggle | Floor-plan view switch for facilities | List ↔ map |
| Create-edit-view | Standard master UX pattern | Same 3-screen flow |
| Error log | Structured capture of system failures | API 500 trace |

## 3. Scope In/Out

In: HR roster/attendance/leave hooks (payroll-hook-only); Facilities/Services/Pricelists/Codes masters + preset JSON; company + branch selector + subdomain login; Data Explorer + Reports (collection/OPD-IPD/pharmacy/lab/OT/therapy) + structured logs/errors; Clinical Establishments / NABH / NABL evidence + consent audit; WhatsApp/SMS rails; Entity/Practitioner/Facility/Service pattern + map toggle.
Out: payroll computation, SSO/OIDC, multi-tenant self-onboarding dashboards, helpdesk/tasking, event-driven/HA/airgapped deployment (Phase 3).

## 4. MUST Functionalities (P0)

- MUST-1201: HR MUST manage staff profiles (role, dept, branch, join/exit) with roster planning per facility/shift and attendance capture (manual + biometric hook).
- MUST-1202: Leave requests MUST flow request → approve → hook-event for payroll; the system MUST NOT compute salary (payroll-hook-only, export only).
- MUST-1203: Admin MUST govern Facilities/Services/Pricelists/Billing-codes masters with versioning; price changes MUST never rewrite historical invoices.
- MUST-1204: Facility presets MUST ship as JSON (MRI/CT/X-ray/USG rooms, chairs, Nadi rooms) importable per branch and extensible without code.
- MUST-1205: Company + Branch selector MUST scope all data; login MUST be subdomain-compulsory (`<branch>.domain/login`) with cross-branch blocked by default.
- MUST-1206: Data Explorer MUST offer filterable views over appointments, billing, pharmacy, lab, OT, therapy with CSV export and saved views.
- MUST-1207: Reports MUST cover collection, OPD/IPD census, pharmacy, lab TAT/volumes, OT utilization, therapy sittings — each printable + exportable.
- MUST-1208: Every module MUST write structured logs + error traces viewable by role, with PHI redaction in error payloads.
- MUST-1209: Compliance MUST maintain Clinical Establishments registers, NABH/NABL evidence checklists with status, and a searchable consent archive.
- MUST-1210: Every PHI read/write MUST append to an immutable audit trail (who/when/what/patient) exportable for inspection.
- MUST-1211: WhatsApp/SMS rails MUST serve slips, reports, recalls, and family updates from one configured gateway with delivery logs + opt-out respect.
- MUST-1212: Entity/Practitioner/Facility/Service screens MUST follow the standard create-edit-view pattern; Facility views MUST include a list ↔ floor-map toggle.
- MUST-1213: User/role administration MUST gate every MUST above (role × branch × action matrix) with least-privilege defaults.
- MUST-1214: New branch + subdomain + pricelist MUST go live through UI config alone (acceptance-verified, no deploy).

## 5. SHOULD P1 (4-6)

- SHOULD-1201: Scheduled report subscriptions (daily collection to email/WhatsApp).
- SHOULD-1202: Deputed/float staff across branches with single attendance record.
- SHOULD-1203: Compliance expiry watch (licenses, AMC, calibrations) with alerts.
- SHOULD-1204: Announcement broadcast (staff + patient cohorts) via SMS/WhatsApp.
- SHOULD-1205: Read-only auditor role with full-report + audit-trail access.

## 6. Entities & States

Entities: Staff, Roster, Attendance, LeaveRequest, Branch, Company, Facility (preset-seeded), CodeSet (ICD/CPT/HCPCS), ReportDef, AuditLog, ConsentRecord, MessageLog.
States: LeaveRequest `applied → approved | rejected → payroll-exported`; Staff `active → on-notice → exited`; ReportDef `draft → published`; ComplianceItem `pending → evidenced → verified | overdue`.

## 7. Workflows

Staff: Create profile → Roster → Attendance → Leave → Payroll-hook export.
Branch: Create branch → Assign subdomain → Seed facility presets → Attach pricelists → Go live.
Compliance: Checklist item → Upload evidence → Verify → Audit-ready pack.
Messaging: Event (slip/report/recall) → Template → Gateway → Delivery log → Retry/opt-out.

## 8. Business Rules

- BR-1201: Masters versioned; price/master edits effective-date forward only.
- BR-1202: All PHI access logged; no bulk export without approver + reason.
- BR-1203: Cross-branch data access denied unless explicitly delegated + audited.
- BR-1204: Payroll data is export-only; no salary computation or bank writes in v1.
- BR-1205: Error logs redact PHI/PII by default; full payloads need admin role.
- BR-1206: Inactive staff lose login immediately; historical attribution retained.
- BR-1207: Consent archive immutable — replace creates new version, never edit.

## 9. CX Requirements

- Admin lands on an ops-at-a-glance dashboard: attendance gaps, pending leaves, low-stock, unsigned reports, compliance overdue.
- Every master follows the identical create-edit-view pattern — learn once, use everywhere.
- Facility map toggle is visual and fast: floor plan with status colors + click-to-drill.
- Report builder is no-code: pick module → filters → columns → save/schedule/export.
- Messaging shows delivery state inline (sent/delivered/read/failed) with retry.
- Branch switching is explicit (selector + subdomain reflect each other); no silent cross-branch writes.

## 10. Reports & Acceptance

Reports: master completeness, user activity, attendance/leave summary, message delivery, compliance checklist status, error/volume health; all export/print.
Acceptance: (a) new branch + subdomain + pricelist live without code change; (b) every module's reports export + print; (c) PHI touch reconstructible from audit trail; (d) payroll export contains leave/attendance inputs, zero computed pay.
