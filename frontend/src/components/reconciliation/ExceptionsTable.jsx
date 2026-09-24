import DataTable from '../common/DataTable';
import StatusBadge from '../common/StatusBadge';
import { titleCase, valueOrDash } from '../../utils/formatters';

export default function ExceptionsTable({ rows }) {
  const columns = [
    { key: 'category', label: 'Category', render: titleCase },
    { key: 'field_name', label: 'Field', render: titleCase },
    { key: 'item_description', label: 'Item', render: valueOrDash },
    { key: 'item_status', label: 'Item Status', render: (value) => value ? <StatusBadge value={value} /> : '—' },
    { key: 'actual_value', label: 'Actual', render: valueOrDash },
    { key: 'filed_value', label: 'Filed', render: valueOrDash },
    { key: 'difference', label: 'Difference', render: valueOrDash },
    { key: 'severity', label: 'Severity', render: (value) => <span className={`severity severity-${String(value || '').toLowerCase()}`}>{value}</span> },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge value={value} /> },
  ];
  return <DataTable columns={columns} rows={rows || []} emptyTitle="No exceptions — the documents matched" />;
}
