# 17 — Services

## 1. Purpose
One priced, bookable, billable catalog of everything the organization sells — consults, procedures, tests, therapies, packages — so that booking, clinical ordering, and billing all speak the same language. A new service goes from definition to revenue without code changes.

## 2. Ubiquitous Language

| Term | Definition | Example |
|---|---|---|
| Service | Orderable/bookable unit of care or goods-bundle | RCT sitting, MRI Brain |
| Code | Unique short identifier for a service | SRV-RCT-01 |
| Department | Owning clinical area | Dental, Physio |
| Pathy | Medical system the service belongs to | Ayurveda, Allopathy |
| Modality | Care setting the service runs in | OPD / IPD / daycare / tele |
| Duration | Standard slot length for booking | 30 min |
| Facility mapping | Required bookable unit(s) to deliver a service | MRI Brain → MRI room |
| Pricelist price | Payer-specific charge for a service | Cash ₹800 / CGHS ₹650 |
| Tax/GST | Tax treatment attached to price | 18% GST slab |
| Package bundling | Grouping services into a prepaid bundle | Physio 10-pack |
| Consent template | Service-linked consent form required pre-procedure | RCT consent |
| Pre-requisite | Clinical readiness check before execution | PAC, fasting report |
| Daycare capture | Procedure documentation for same-day care | Panchkarma sitting note |
| Versioning | Price/master changes as new versions, history kept | v3 from 2026-04 |
| Redemption | Consuming package scope against a visit | 1 sitting redeemed |

## 3. Scope In/Out

In: service master (name/code/dept/pathy/modality/duration), required facility mapping, pricelist-wise cost + tax/discount + package bundling, clinical binding (orders/consent/prereqs/daycare), billing binding (invoice line / package redeem / continuous IPD), versioning, standard create-edit-view pattern.
Out: external charge-master auto-sync (CGHS import), claims adjudication, roster/scheduling engine (see 18), stock management (see 08).

## 4. MUST Functionalities (P0)

- MUST-1701: Admin MUST create/edit/view a Service with name, unique code, department, pathy, modality, duration, and active flag via a standard pattern UI.
- MUST-1702: Every Service MUST list required facilit(ies); booking MUST be blocked when no facility mapping exists (except pure consult/tele, explicitly exempted).
- MUST-1703: Service MUST carry pricelist-wise prices (cash/CGHS/ECHS/TPA) with GST/tax treatment and effective dates.
- MUST-1704: Admin MUST define discount rules per service/pricelist (max %, approver threshold) consumed by billing.
- MUST-1705: Admin MUST bundle services into packages (sessions, validity, scope) that billing redeems against — e.g. RCT + crown, Panchkarma 7-day.
- MUST-1706: Service MUST bind to clinical order entry: selecting it MUST raise the right order type (lab/radio/procedure/therapy) with defaults.
- MUST-1707: Service MUST bind a consent template where required; execution MUST be blocked until signed consent is on file.
- MUST-1708: Service MUST declare pre-requisites (PAC, reports, fasting); booking/execution MUST warn or block per severity.
- MUST-1709: Daycare-modality services MUST open a procedure-capture note (pre/post, materials) on the appointment/visit.
- MUST-1710: Every Service MUST bill as a sales-invoice line and accrue to continuous IPD tabs where applicable; package-scope visits MUST redeem, not charge.
- MUST-1711: All master and price changes MUST version (new effective row); historical invoices/orders MUST keep the price-at-time.
- MUST-1712: Inactive services MUST hide from booking/ordering while remaining in history and reports.
- MUST-1713: Search MUST work by name, code, department, pathy, and modality with <100ms type-ahead for front-desk speed.
- MUST-1714: Duplicate service (same name + dept + modality) MUST be blocked with a merge suggestion.

## 5. SHOULD P1 (4-6)

- SHOULD-1701: Service bundles with optional add-ons (crown type choice on RCT pack).
- SHOULD-1702: Demand-based duration overrides (senior consultant = longer slot).
- SHOULD-1703: Payer formulary flags (CGHS-approved-only marker).
- SHOULD-1704: Utilization alerts (low-demand services flagged quarterly).
- SHOULD-1705: Bulk price revision with preview + approval before publish.

## 6. Entities & States

Entities: Service, ServiceFacilityMap, ServicePrice (versioned), Pricelist, DiscountRule, PackageDef (+members), ConsentBinding, PrereqRule, ServiceVersion.
States: Service `draft → published → inactive`; Price `future → active → superseded`; PackageDef `draft → published → retired`.

## 7. Workflows

Define Service → Map required facilit(ies) → Set pricelist prices + tax → Attach consent/prereqs → Bundle into package (optional) → Publish → Book/Order → Execute (+daycare capture) → Bill/Redeem.
Price change: new version with effective date → future bookings use new price → old invoices untouched.

## 8. Business Rules

- BR-1701: No facility mapping → no booking (consult/tele exempt by explicit flag, not by omission).
- BR-1702: Price change never rewrites history; effective-dating only.
- BR-1703: Package-scope services redeem against balance; direct billing blocked while balance covers.
- BR-1704: Consent-required services block execution (not booking) without signed consent.
- BR-1705: Codes are unique and immutable once published; renames create alias, not rewrite.
- BR-1706: Inactive/retired definitions stay reportable; deletion is forbidden, only retirement.

## 9. CX Requirements

- Service creation is a single guided form: basics → facilities → prices → clinical bindings → publish checklist.
- Booking search shows price (per active pricelist), duration, and facility availability inline.
- Publish checklist shows blockers (no facility, no price, missing consent) before go-live.
- Version history is one click from the service page: what changed, when, by whom.
- Package definition previews redemption math (sessions × services, validity) before publish.

## 10. Reports & Acceptance

Reports: service volumes, revenue by service/dept/pathy/payer, package liability/expiry, facility-wise demand, unpublished/inactive hygiene, price-change audit.
Acceptance: (a) new service + facility + price → bookable and billable with zero code change; (b) every invoice line traces to an ordered service or package redemption; (c) price revision leaves historical invoices byte-identical; (d) consent-required service cannot execute unsigned.
