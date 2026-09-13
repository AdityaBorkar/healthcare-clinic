# 08 — Pharmacy + Inventory

## 1. Purpose
Dispense the right drug, batch, and quantity to the right patient at the right price — with full batch traceability — while keeping store, OT, and ward stock accurate, available, and GST-compliant. This module links prescriptions (all EMRs) to sales, and IPD/OT consumption to continuous billing.

## 2. Ubiquitous Language

| Term | Definition | Example |
|---|---|---|
| Item | Sellable/stockable master (drug, consumable, implant) | Tab Paracetamol 650mg |
| Batch | One lot of an Item with expiry + MRP | B-2411, exp 2027-05 |
| FEFO | First-Expiry-First-Out issue order | Nearest-expiry batch auto-picked |
| Substitute | Therapeutically equivalent Item offered on stock-out | Same salt, other brand |
| Partial dispense | Fulfilling fewer days/qty than prescribed, balance pending | 10 of 30 tabs now |
| GRN | Goods Receipt Note recording vendor delivery | GRN-1042 vs PO-881 |
| PO | Purchase Order raised on a vendor | PO-881 for 200 units |
| Purchase invoice | Vendor bill booked against GRN | PI-553 + GST lines |
| CN / DN | Credit/Debit Note adjusting a purchase or sale | Expiry-return CN |
| Indent | Internal stock request (ward/OT → store) | OT indent for sutures |
| Consumption | Stock used in care, billed to IPD/OT episode | 2 sutures consumed |
| Pricelist | Vendor- or Entity-wise rate list | Vendor X rate 2026 |
| Reorder level | Min stock triggering a purchase alert | Reorder at 50 strips |
| Continuous billing | Accumulating IPD consumables onto the running bill | Day-3 dressing added |
| Return | Patient/vendor stock flowing back with reason | Patient return, breakage |

## 3. Scope In/Out

In: prescription-linked sales, substitutes, partial/balance dispense, patient returns, GST sales invoice print/WhatsApp; Item/Batch/expiry masters, FEFO, reorder, PO → GRN → purchase invoice → CN/DN; store → OT/ward transfers; OT indent + consumption; vendor/entity pricelists; continuous IPD/long-stay consumable billing.
Out: auto NEFT/bank reconciliation, POS hardware integration, narcotics e-licensing portal sync (hook only), manufacturing/expiry re-labelling.

## 4. MUST Functionalities (P0)

- MUST-0801: Pharmacist MUST create a sale from a live prescription (any EMR) with auto-pull of drug lines, dosage days → qty conversion, and one-click substitute offer on stock-out.
- MUST-0802: System MUST support partial dispense with a tracked balance (pending qty per line) closable on next visit or cancellable with reason.
- MUST-0803: System MUST process patient returns against the original bill (batch-matched), restock or quarantine, and issue CN/receipt adjustment.
- MUST-0804: Every sale MUST emit a GST invoice (CGST/SGST split) with print + WhatsApp delivery from the bill screen.
- MUST-0805: Item master MUST version generics, strength, pack, HSN/GST slab, schedule (H/H1/X), and cold-chain flag; duplicates blocked by salt+strength+pack.
- MUST-0806: Every stocked receipt MUST capture batch, expiry, MRP, and rate; sale/issue MUST follow FEFO by default with override reason.
- MUST-0807: Expired batches MUST be un-dispensable (hard block) and near-expiry (<90d) MUST surface in a daily alert list.
- MUST-0808: Reorder-level breach MUST raise a PO suggestion (item, deficit qty, preferred vendor from pricelist); PO → GRN → purchase invoice MUST be one traceable chain.
- MUST-0809: Purchase flow MUST support short/excess/damage at GRN, and CN/DN against purchase invoice with GST adjustment.
- MUST-0810: Store → OT/ward transfer MUST move stock between locations with accept step; negative stock MUST be blocked at every issue point.
- MUST-0811: OT MUST raise indents against cases and capture consumption per surgery; consumption MUST post to the IPD bill (continuous billing) and decrement OT stock.
- MUST-0812: Vendor + Entity pricelists MUST drive PO vendor choice and purchase rate validation (tolerance flag on deviation).
- MUST-0813: IPD/long-stay consumables (dressings, IV sets, ward issues) MUST accumulate onto the running episode bill without re-billing the patient at bedside.
- MUST-0814: Every stock movement MUST write an auditable ledger line (who/when/what/batch/qty/from→to); backdated edits MUST be denial with correction-note flow.
- MUST-0815: Pharmacist MUST see a prescription → bill flow completable in <30s for a 5-line prescription with full batch trace.

## 5. SHOULD P1 (4-6)

- SHOULD-0801: ABC/XYZ slow-mover analysis with dead-stock return suggestions.
- SHOULD-0802: Barcode/QR scan at GRN and sale for batch pick speed.
- SHOULD-0803: Vendor performance scorecard (fill-rate, lead-time, return %).
- SHOULD-0804: WhatsApp refill reminders for chronic (30/60/90-day) therapies.
- SHOULD-0805: Inter-branch indent/transfer with transit state.

## 6. Entities & States

Entities: Item, Batch, StockLedger, Location (Store/OT/Ward), PrescriptionDispense (+lines, balance), SaleInvoice, SalesReturn, PO, GRN, PurchaseInvoice, CN/DN, Vendor, EntityPricelist, Indent, Consumption.
States: DispenseLine `pending → partial → fulfilled | cancelled`; PO `draft → sent → partial → closed`; GRN `open → verified → billed`; Indent `raised → issued → accepted | rejected`; Batch `active → near-expiry → expired → quarantined`.

## 7. Workflows

Prescription sale: Prescription → Pull lines → FEFO batch pick → Substitute offer if OOS → Partial/balance → GST invoice → Print/WhatsApp → Ledger post.
Purchase: Reorder alert → PO → Vendor delivery → GRN (short/damage) → Purchase invoice → CN/DN if needed → Stock live.
Internal: Ward/OT indent → Store issue → Accept → Consume in care → Post to IPD bill.
Return: Original bill → Batch match → Restock/quarantine → CN + receipt.

## 8. Business Rules

- BR-0801: No dispense/issue from expired or quarantined batches — hard block, no override.
- BR-0802: FEFO is default; any manual batch change needs a reason logged.
- BR-0803: Negative stock is impossible at any location; transfers need receiver accept.
- BR-0804: Schedule-H1 items require prescription linkage; OTC-only items flagged at master.
- BR-0805: Purchase rate deviating >tolerance from pricelist flags for approver.
- BR-0806: Returns only against original bill within policy window (configurable days); cash refunds above threshold need approver.
- BR-0807: Consumption always references an episode (IPD/OT case); orphan consumption rejected.

## 9. CX Requirements

- Pharmacist works keyboard-first: type-ahead item/salt search, Enter-to-next-line, F-key bill/print.
- Substitute dialog shows salt match, price delta, stock — one click to swap.
- Partial dispense shows pending balance chip on next patient visit.
- Alerts (expiry/reorder) visible as a morning checklist, not hidden in a report.
- Invoice print and WhatsApp buttons adjacent; failure shows retry, never silent loss.
- OT indent screen is case-contextual (patient + surgery pre-filled).

## 10. Reports & Acceptance

Reports: stock-in-hand (location × batch), expiry <90d, reorder/deficit, sales by doctor/item, substitute %, purchase vs GRN variance, vendor dues, OT consumption per case, IPD unbilled consumables.
Acceptance: (a) prescription → GST bill in <30s with batch trace to GRN/PO; (b) expired batch cannot be billed even by admin override; (c) OT consumption appears on IPD interim bill same session; (d) every stock movement has a ledger line with actor + timestamp.
