# 21 — Units of Measurement (UOM)

## 1. Purpose

One governed master for every measurable quantity in the system — drug strengths, dispense packs, lab volumes, service durations, package sessions, consumable counts — so that ordering, dispensing, scheduling, and billing never disagree on what "1 unit" means. This is a **universal, project-agnostic master**: the same category → base-unit → conversion-factor pattern serves healthcare, retail, manufacturing, or any future project without redesign. Domain modules (Services-17, Pharmacy-08, Lab/Radio-09) consume UOMs; none of them redefine units locally.

## 2. Ubiquitous Language

| Term | Definition | Example |
|---|---|---|
| UOM | A named measurable unit with symbol, precision, and category | Tablet (`tab`), millilitre (`mL`), minute (`min`) |
| UOM Category | A dimension family inside which conversion is legal | Count, Weight, Volume, Length, Time, Session |
| Base Unit | The canonical unit of a category all factors resolve to | `tab` for Count-dispense, `mg` for Weight, `min` for Time |
| Conversion Factor | Multiplier to the category base unit (`qty × factor = base qty`) | 1 strip of 10 tabs = factor 10 → base `tab` |
| Precision | Max decimal places stored/displayed for a UOM | `tab` = 0 decimals; `mL` = 2; `kg` = 3 |
| Symbol | Short immutable print/scan token for a UOM | `tab`, `strip`, `mL`, `min`, `sitting` |
| Reference UOM | The UOM a master record (Item/Service) is stocked/priced in | Paracetamol stocked in `strip`, priced per `tab` |
| Transaction UOM | The UOM a single line (sale, order, invoice) is entered in | Dispense 1.5 `strip` → posts 15 `tab` |
| Session UOM | Non-physical countable delivery unit for services | `sitting`, `session`, `visit`, `day` |
| Quantity Pair | The rule that every quantity is stored with its UOM, never naked | `qty=15 + uom=tab`, not `qty=15` |
| Cross-category Conversion | Forbidden operation across dimensions | `kg` → `mL` rejected unless a density map exists (out of scope) |

Seed categories (v1): `Count` (tab, strip, box, vial, ampoule, piece, pack), `Weight` (mg, g, kg), `Volume` (mL, L), `Length` (cm, inch), `Time` (min, hour, day, week), `Session` (sitting, session, visit, cycle, course).

## 3. Scope In/Out

In: UOM + Category master (name/symbol/category/factor/precision/active), one base unit per category, intra-category conversion chain, reference-vs-transaction UOM display math, standard create-edit-view pattern, branch-scoped-visibility (global by default), versioned factor changes, audit, export/print, global-search registration.
Out: density/specific-gravity cross-dimension conversion, device/IoT auto-unit detection, locale-driven unit auto-switching (display hint only), currency handling (see Pricelist in 17), manufacturing BOM yield math (consumes this master later).

## 4. MUST Functionalities (P0)

- MUST-2101: Admin MUST create/edit/view a UOM with name, unique symbol, category, factor-to-base, precision, and active flag via a standard pattern UI.
- MUST-2102: Every Category MUST declare exactly one Base Unit (factor = 1); system MUST reject a second base or a category with none at publish.
- MUST-2103: Conversions MUST be allowed only inside the same category; cross-category qty entry MUST be rejected with the expected-category message.
- MUST-2104: Every stored quantity MUST persist as a Quantity Pair (`qty` + `uom_id`); naked-quantity writes MUST fail validation.
- MUST-2105: Factor changes MUST version prospectively (new effective row); historical ledger/invoice lines MUST keep the factor-at-time and never restate.
- MUST-2106: Symbols MUST be unique (case-insensitive) and immutable once published; renames create an alias row, not a rewrite.
- MUST-2107: Each Category MUST have one marked Default UOM used when callers omit a unit (e.g. `tab` for Count-dispense, `min` for Time); Default MUST be reassignable only to an active UOM in the same category.
- MUST-2108: Item/Service masters MUST declare a Reference UOM; transaction lines MUST accept any active UOM in the same category and post both entered and base-converted quantities.
- MUST-2109: Precision MUST be enforced at entry, display, and rounding (e.g. `tab` rejects 1.5 tabs where indivisible; `mL` rounds to 2 dp with half-up) and MUST be visible on the UOM row.
- MUST-2110: Inactive UOMs MUST hide from new entries while remaining in history and reports; deletion of a used UOM MUST be forbidden (retire only).
- MUST-2111: Duplicate UOM (same name or symbol, case-insensitive) MUST be blocked with a merge/alias suggestion.
- MUST-2112: Seed-on-install MUST ship a global UOM set (Count/Weight/Volume/Time/Session per §2) marked `is_system`; system rows MUST be editable for precision/active only, never for factor/symbol/category without a versioned change + reason.
- MUST-2113: Search MUST work by name, symbol, and category with <100ms type-ahead for dispensing/billing speed.
- MUST-2114: Every UOM write (create/factor-version/activate/retire/Default-reassign) MUST write an audit line (actor, time, old → new); factor history MUST be one click from the UOM page.

## 5. SHOULD P1 (4-6)

- SHOULD-2101: Pack-size helper (strip = N tabs, box = M strips) auto-deriving factors at Item creation.
- SHOULD-2102: Dimensional Poular hints — display dual units where helpful (e.g. `500 mg = 0.5 g`) without changing stored base.
- SHOULD-2103: Indivisibility flag per UOM (`tab`/`vial` non-splittable vs `mL` splittable) with split-guard at dispense.
- SHOULD-2104: Locale display preference (inch ↔ cm) as view-layer hint only; storage stays in base.
- SHOULD-2105: Bulk UOM import with factor-sanity preview (outlier factor flagged before publish).

## 6. Entities & States

Entities: UomCategory, Uom (+alias), UomVersion (factor/precision history), QuantityPair (embedded convention, not a table).
States: Uom `draft → published → inactive (retired)`; UomVersion `future → active → superseded`; Category `draft → published` (never deleted while UOMs reference it).

## 7. Workflows

Define Category (+ base) → Add UOMs (symbol/factor/precision) → Mark Category Default → Publish → Bind as Reference UOM on Item/Service → Transact in any same-category UOM → Store pair + base equivalent → Retire (never delete).
Factor change: new version with effective date + reason → future transactions use new factor → old ledgers untouched.

## 8. Business Rules

- BR-2101: No naked quantities — every qty column travels with a `uom_id`.
- BR-2102: Conversion is intra-category only; factor math is `base_qty = entered_qty × factor`, inverted for display.
- BR-2103: One base per category; one Default per category; both must be active + published.
- BR-2104: Symbols unique case-insensitively and immutable after first use; renames become aliases.
- BR-2105: Factor/precision changes are prospective versions; history is immutable.
- BR-2106: Indivisible UOMs reject fractional qty at entry with a clear message (e.g. "Tablets cannot be split — use syrup mL variant").
- BR-2107: UOMs default to global visibility; branch-local override is by precision/display preference only, never by redefining the factor.

## 9. CX Requirements

- UOM creation is a single short form: name → symbol → category → factor → precision → publish checklist (base set? symbol unique? Default assigned?).
- Every qty field across the product shows its UOM chip inline; changing the unit previews the converted qty before save.
- Publish checklist shows blockers (no base, duplicate symbol, precision missing) before go-live.
- Factor history is one click from the UOM page: what changed, when, by whom, effective date.
- Error messages name the expected category ("Expects Volume (mL/L) — you entered kg") plus the next step.

## 10. Reports & Acceptance

Reports: UOM usage by module (which Items/Services bind which UOM), factor-change audit, inactive/orphan hygiene (UOMs bound to no master), precision-violation attempts.
Acceptance: (a) new UOM + category → immediately usable on Item/Service with zero code change; (b) entering 1.5 `strip` (factor 10) posts 15 `tab` base with both values visible; (c) factor revision leaves historical ledgers byte-identical; (d) `kg` entered on a `mL` field is rejected; (e) fractional `tab` rejected where indivisible.
Adoption contract for other modules: Services-17 (duration/billing/session UOMs), Pharmacy-08 (Reference UOM per Item, FEFO in base qty), Lab/Radio-09 (sampleVolume UOM, result UOM) — all MUST reference `Uom.id`, never free-text units.
