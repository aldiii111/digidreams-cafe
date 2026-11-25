# DigiDreams Mini-POS

Point-of-sale for DigiDreams Cafe & Coworking Space: a cashier rings up drinks, food, and coworking passes, applies a promo code, takes payment, and issues a receipt. This glossary fixes the words we use for that sale flow.

## Language

### Sale flow

**Order**:
A completed sale at the register — one customer, one payment, one receipt.
_Avoid_: Transaction, sale, purchase

**Cart**:
The working set of items a cashier is assembling before payment. Exists only on the POS screen until checkout turns it into an Order.
_Avoid_: Basket, draft order

**Order Item**:
One line on an Order: a product, a quantity, the unit price captured at the time of sale, and that line's own amount.
_Avoid_: Line, line item, entry

**Receipt**:
The digital proof of a paid Order, formatted for display and thermal print. Shows the invoice number, items, and totals.
_Avoid_: Bill, invoice (a receipt is not an invoice even though it carries the invoice number)

### Catalog

**Product**:
A sellable menu item — a drink, a food, or a coworking pass — with a price and a stock count.
_Avoid_: Item, SKU, menu entry

**Category**:
A grouping of Products: Coffee, Non-Coffee, Food, Coworking Space.
_Avoid_: Type, group, tag

**Stock**:
The number of units of a Product currently available to sell. Decreases when an Order is paid.
_Avoid_: Quantity, inventory, count

**Coworking Pass**:
A Product that grants time-based access to the coworking space (e.g. 8 hours, or a full day).
_Avoid_: Space ticket, membership, seat

### Pricing

**Subtotal**:
The sum of every Order Item's amount, before any promo or tax.
_Avoid_: Gross, base price

**Promo**:
A redeemable code that reduces the Order under conditions (minimum order, active date window).
_Avoid_: Voucher, coupon, discount code

**Discount**:
The amount a Promo removes from the Subtotal.
_Avoid_: Deduction, markdown, potongan

**PPN**:
Indonesian value-added tax, fixed at 10%, computed on the amount remaining after Discount.
_Avoid_: Tax, VAT, pajak

**Total**:
What the customer pays: Subtotal minus Discount, plus PPN.
_Avoid_: Grand total, amount due, tagihan

### Identifier & payment

**Invoice Number**:
The human-readable identifier printed on a Receipt, in the form `INV-<year>-<sequence>`.
_Avoid_: Order ID, reference, transaction number

**Payment Method**:
How the Order was paid: cash or QRIS.
_Avoid_: Payment type, tender
