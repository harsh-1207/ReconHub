import Card from "../common/Card";
import DataTable from "../common/DataTable";
import { valueOrDash } from "../../utils/formatters";

export default function CanonicalInvoiceView({ invoice }) {
  if (!invoice) return null;
  const fields = [
    ["Invoice Number", invoice.invoiceNumber],
    ["Vendor", invoice.vendor],
    ["Date", invoice.date],
    ["Currency", invoice.currency],
    ["Subtotal", invoice.subtotal],
    ["Tax", invoice.tax],
    ["Total", invoice.total],
  ];
  const columns = [
    { key: "position", label: "#" },
    { key: "itemCode", label: "Item Code" },
    { key: "description", label: "Description" },
    { key: "quantity", label: "Quantity" },
    { key: "unitPrice", label: "Unit Price" },
    { key: "tax", label: "Tax" },
    { key: "amount", label: "Amount" },
  ];
  return (
    <>
      <Card
        title="Canonical header"
        subtitle="Normalized values used by the reconciliation engine."
      >
        <dl className="detail-grid">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{valueOrDash(value)}</dd>
            </div>
          ))}
        </dl>
      </Card>
      <Card title={`Line items (${invoice.items?.length || 0})`}>
        <DataTable
          columns={columns}
          rows={invoice.items || []}
          rowKey="position"
          emptyTitle="No line items found"
        />
      </Card>
    </>
  );
}
