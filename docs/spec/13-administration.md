# 13 — Administration

## 1. Purpose

Let non-technical admins set up the company and branches, control who can do what, govern masters without code changes, and prove compliance through logs — so a new branch, subdomain, or rate card goes live the same day.

## 2. Ubiquitous Language

| Term | Definition | Example |
|---|---|---|
| Company | The legal organization record: name, logo, address, contacts | Sri Clinics Pvt Ltd |
| Branch | Operating site with address, hours, phone, and rate card | Erode Main branch |
| Subdomain | The branch or org web prefix used for login routing | erode.example.com/login |
| User | A login identity tied to a staff member | Receptionist Kala |
| Role | A named bundle of permissions assigned to users | Branch Admin, Nurse |
| Permission | One allowed action on one module or view | Approve merge requests |
| Master | A governed reference list used across modules | Service master, ICD list |
| Master Version | A dated snapshot of a master with effective range | Pricelist v2026-09 |
| Audit Log | Tamper-evident trail of writes and PHI reads | Bill edited by Ravi at 10:02 |
| Template | Approved SMS or WhatsApp message format with placeholders | Appointment reminder template |
| Data Explorer | Admin-safe browser of tables with filters and export | Find unpaid IPD bills |
| Smart Field | Reusable validated input with lookup and help text | Practitioner picker field |
| Field Map | Mapping between form fields and record columns | Registration form mapping |
| Recall Rule | Condition that triggers a follow-up reminder | Diabetes review due in 90 days |

## 3. Scope

**In Scope**

- Company and branch master, header branch selector, compulsory subdomain login per hospital.
- User and role management across all ten roles; role-based sidebar views ERP, Doctor, Nursing, Reception.
- Masters governance with versioning and audit: practitioners, patients, facilities, services, pricelists, vendors, billing codes, lab tests.
- Navigation handling including forward routes, branch-scoped lists, Data Explorer, Forms with smart fields and field maps, reports access control.
- Universal export and print, global search and actions, structured logs, SMS and WhatsApp template config, file policy enforcement.

**Out of Scope**

- OIDC, SSO, and SAML federation; multi-tenant self-onboarding dashboards.
- Task and helpdesk ticketing, SOP and SLA workflow engine, high-availability and airgapped deploys (Phase 3).

## 4. MUST Functionalities

- **MUST-001 — Company profile setup**: What: maintain name, logo, address, phones, registration numbers. Who: Org Admin. Accepts: header and prints reflect edits immediately.
- **MUST-002 — Branch creation with subdomain**: What: create branch with address, hours, phone, and login subdomain. Who: Org Admin. Accepts: new branch login URL works same day.
- **MUST-003 — Header branch selector**: What: switch active branch; all branch-scoped lists re-filter. Who: multi-branch staff. Accepts: switching changes queue and rates.
- **MUST-004 — User lifecycle**: What: create, disable, transfer, and reset credentials for staff. Who: Org or Branch Admin, HR. Accepts: disabled user cannot log in instantly.
- **MUST-005 — Role and permission matrix**: What: assign granular permissions per role and sidebar view. Who: Org Admin. Accepts: denied view shows clear no-access message.
- **MUST-006 — Sidebar view assignment**: What: map roles to ERP, Doctor, Nursing, Reception views. Who: Org Admin. Accepts: nurse login lands on Nursing view.
- **MUST-007 — Masters versioning**: What: version pricelists, services, and codes with effective dates. Who: Branch Admin, Accountant. Accepts: old invoices keep old rates after change.
- **MUST-008 — Branch scoping of masters**: What: mark each master row branch-local or global. Who: admins. Accepts: local service invisible at other branches.
- **MUST-009 — Data Explorer access control**: What: grant table browsing per role with export gating. Who: admins, accountants. Accepts: unauthorized table hidden from explorer.
- **MUST-010 — Form and field-map builder**: What: assemble forms from smart fields and map to records without code. Who: admins. Accepts: new registration field live without deploy.
- **MUST-011 — Global search and actions wiring**: What: register searchable entities and palette commands per module. Who: admins with IT support. Accepts: new service type appears in Ctrl+F.
- **MUST-012 — Template management**: What: create and approve SMS and WhatsApp templates with placeholders. Who: admins. Accepts: unapproved template cannot send.
- **MUST-013 — Recall rules configuration**: What: define follow-up and defaulter recall conditions per department. Who: admins. Accepts: due list populates automatically.
- **MUST-014 — Log and error review**: What: browse structured audit, login, and error logs with filters. Who: admins, IT support. Accepts: failed login shows user, time, branch.
- **MUST-015 — File policy guardrails**: What: enforce WebP 2MB image and 20MB PDF limits with messages. Who: all uploaders via admin setting. Accepts: oversize upload rejected gracefully.

## 5. SHOULD (P1)

- SHOULD-001: Master completeness dashboard flagging missing fees, schedules, and codes.
- SHOULD-002: Bulk user import with role mapping and password reset links.
- SHOULD-003: Template usage counts and delivery success per branch.
- SHOULD-004: Holiday calendar inherited by schedules with branch overrides.
- SHOULD-005: One-click branch cloning for new-site setup.

## 6. Entities & States

- Entities: Company, Branch, User, Role, Permission, MasterVersion, Template, RecallRule, AuditLog, ReportDef.
- User states: invited, active, locked, disabled. Branch states: setup, active, closed.
- Template states: draft, approved, retired. MasterVersion states: draft, effective, superseded.

## 7. Workflows

1. Create company profile and first admin user.
2. Create branch with subdomain, hours, and contact details.
3. Create roles, assign sidebar views, then create users per branch.
4. Seed and version masters: services, pricelists, codes, lab tests.
5. Configure templates, recall rules, forms, and Data Explorer grants.
6. Go live, monitor logs and master completeness, audit monthly.
7. Clone or add branches by copying globals and overriding rates.

## 8. Business Rules

1. All masters are branch-scoped unless explicitly marked global.
2. Every write and PHI read is audited with user and timestamp.
3. Price and code changes take effect prospectively; history is immutable.
4. Disabled or locked users lose access immediately across branches.
5. Only approved templates may send SMS or WhatsApp.

## 9. Customer Experience Requirements

- Speed: user and role saves under 1 second; log search under 2 seconds.
- Clicks: new branch plus subdomain plus pricelist in under 10 admin screens.
- Print and WhatsApp: template previews show exact bilingual message before approval.
- Tamil and English: branch names, addresses, and templates bilingual on prints.
- Error messages: permission denials name the missing role and whom to ask.

## 10. Reports & Acceptance

- Reports: user activity, login audit, master completeness, branch-wise OPD and IPD census.
- Acceptance: new branch with subdomain and pricelist live without deploy; restricted views blocked per role with audit of attempts; historical invoices unchanged after rate edits.
