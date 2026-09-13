# 10 — Billing + Insurance/TPA

## 1. Purpose
Bill every service once and only once — OPD cash in under a minute, IPD/long-stay as a running tab closable on demand — with payer-correct pricing, approved discounts, package auto-redemption, and claim-ready TPA paperwork. Money movement stays reconcilable: every rupee traces to an order, service, or package redemption.

## 2. Ubiquitous Language

| Term | Definition | Example |
|---|---|---|
| Sales invoice | Final bill for services/goods | INV-2026-1188 |
| CN / DN | Credit/Debit Note adjusting an invoice | Post-discharge CN |
| Continuous billing | Running IPD/long-stay tab updated as care happens | Day-wise additions |
| Package | Prepaid multi-session bundle with expiry | Physio 10-pack |
| Redemption | Consuming one package session against a visit | Sitting 4/10 used |
| Pricelist | Payer-specific rate card (cash/CGHS/ECHS/TPA) | CGHS NABH rates |
| Payer | Who pays: self, TPA, CGHS/ECHS, corporate | MediAssist TPA |
| Pre-auth | Insurer approval for cashless care up to a limit | Pre-auth ₹80k |
| Claim pack | Document set filed for reimbursement | Bills + reports + IDs |
| Advance | Money collected before/against future bills | ₹10k IPD advance |
| Dues ledger | Per-patient outstanding (billed − paid − adjusted) | ₹4,200 due |
| Discount approval | Supervisor sign-off above threshold | >10% needs AM |
| GST export | Tax-period data dump for filing | GSTR-1 CSV |
| Interim bill | On-demand snapshot of a running IPD tab | Day-5 interim |
| Liability | Unearned package balance owed in service | 6 sittings owed |

## 3. Scope In/Out

In: sales invoice/CN/DN (OPD + IPD), continuous IPD/long-stay billing, multi-session packages with expiry + auto-decrement, payer pricelists (cash/CGHS/ECHS/TPA), discount-with-approval, TPA pre-auth + claim checklist, dues/advance ledger, collections dashboard, GST export + print/WhatsApp.
Out: payment gateways/POS/bank validation APIs, insurance eligibility/validation API, claims adjudication decisions, payroll/HR billing.

## 4. MUST Functionalities (P0)

- MUST-1001: Desk MUST raise an OPD invoice from orders/services/prescriptions with payer pricelist auto-applied, and print + WhatsApp the bill + receipt.
- MUST-1002: IPD/long-stay episodes MUST accrue a running tab (bed, procedures, consumables, pharmacy, lab) with on-demand interim bill and final discharge bill.
- MUST-1003: Every invoice line MUST trace to its source (order/service/package redemption/consumption); orphan lines MUST be rejected.
- MUST-1004: Packages MUST define sessions, validity, and service scope; each eligible visit MUST auto-decrement balance and block over-redemption.
- MUST-1005: Expired-package sessions MUST lapse (no redemption, no refund by default) with a liability/expiry report for management decision.
- MUST-1006: Pricelists MUST price by payer (cash/CGHS/ECHS/TPA); switching payer MUST re-price open lines before finalization, preserving audit.
- MUST-1007: Discounts above threshold MUST route for approval (maker-checker) with reason; approved-by stamped on the invoice.
- MUST-1008: Desk MUST collect full/partial/advance payments, split across modes (cash/UPI/card), and issue receipts; dues MUST update live.
- MUST-1009: Dues/advance ledger MUST be per-patient and per-episode, with aging and settlement (advance ↔ dues adjustment) actions.
- MUST-1010: TPA flow MUST track pre-auth (requested/approved/enhanced/denied, amount) against the episode and cap cashless billing at approved limit.
- MUST-1011: System MUST generate a claim-pack checklist (bills, reports, IDs, pre-auth copy, discharge summary hook) with tick-off and file attach.
- MUST-1012: CN/DN MUST reference the original invoice with reason, approver, and GST adjustment; cancelled invoices MUST retain number + audit.
- MUST-1013: GST reports + period export MUST reconcile invoice/CN/DN totals; print + WhatsApp MUST work from every bill screen.
- MUST-1014: OPD bill + receipt MUST complete in <60s; package balance MUST never go negative under concurrency.

## 5. SHOULD P1 (4-6)

- SHOULD-1001: Estimate/quotation (surgery/package cost) with convert-to-invoice.
- SHOULD-1002: Corporate credit-limit billing with monthly statement.
- SHOULD-1003: Dunning reminders (SMS/WhatsApp) for aged dues.
- SHOULD-1004: Day-wise IPD cost projection vs package/insurance cover.
- SHOULD-1005: Cancellation/no-show charge rules per service.

## 6. Entities & States

Entities: Invoice (+lines), CN/DN, Receipt, PackageDef, Package (patient balance), Redemption, Pricelist, Payer, PreAuth, ClaimPack, DuesLedger, Advance.
States: Invoice `draft → finalized → partially-paid → paid | cancelled (via CN)`; Package `active → exhausted | expired`; PreAuth `requested → approved → enhanced | denied | settled`; ClaimPack `open → complete → filed`.

## 7. Workflows

OPD: Service/order → Pricelist price → Discount (approval if needed) → Invoice → Pay (partial/advance) → Receipt → Print/WhatsApp.
IPD: Admit → Advance → Daily accruals (bed/pharmacy/lab/OT) → Interim on demand → Discharge bill → Settle advance/dues → Receipt.
Package: Sell package → Balance created → Each visit auto-redeem → Expiry/exhaust → Liability report.
TPA: Pre-auth request → Approval → Cashless billing to limit → Claim checklist → File pack.

## 8. Business Rules

- BR-1001: No invoice line without a source order/service/redemption — enforced at finalize.
- BR-1002: Discount > threshold (configurable %) requires approver ≠ creator.
- BR-1003: Package sessions redeem only within validity and scope; expired = lapsed.
- BR-1004: Backdated invoices/edits forbidden; corrections via CN/DN only.
- BR-1005: Cashless billing cannot exceed approved pre-auth without enhancement or payer switch.
- BR-1006: Invoice numbers are gapless-sequential per series; cancellations keep the number.
- BR-1007: Refunds above threshold need approver + mode-matched audit (which receipt reversed).

## 9. CX Requirements

- Billing desk is speed-first: returning patient + payer pre-filled, price auto-applied, <60s OPD close.
- Interim IPD bill prints a family-readable summary (grouped by category, not raw lines).
- Discount approval is async: desk continues, approver pings, invoice finalizes on approval.
- Package balance visible at booking/billing so front-desk never oversells.
- Every money screen shows dues/advance context — no blind billing.
- Print and WhatsApp side-by-side; delivery status shown, failures retryable.

## 10. Reports & Acceptance

Reports: daily collection (mode × desk), dues aging, advance outstanding, package liability/expiry, payer-wise revenue, discount/approval audit, cancellation analysis, GST summary + export.
Acceptance: (a) OPD bill + receipt <60s; IPD interim bill on demand matches accrued lines; (b) package over-redemption impossible, expiry lapses cleanly; (c) discount above threshold blocked without approver; (d) every invoice line drills to its source order/redemption.
