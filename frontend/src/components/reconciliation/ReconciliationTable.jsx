import { Link } from "react-router-dom";
import DataTable from "../common/DataTable";
import StatusBadge from "../common/StatusBadge";
import { formatDate, formatPercent } from "../../utils/formatters";

export default function ReconciliationTable({
  rows,
  showReportActions,
  onDownload,
  downloading,
}) {
  const columns = [
    {
      key: "id",
      label: "ID",
      render: (value) => (
        <Link className="table-link" to={`/reconciliations/${value}`}>
          #{value}
        </Link>
      ),
    },
    { key: "actual_document_name", label: "Actual Document" },
    { key: "filed_document_name", label: "Filed Document" },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge value={value} />,
    },
    { key: "match_percentage", label: "Match", render: formatPercent },
    { key: "created_at", label: "Created", render: formatDate },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="table-actions">
          <Link
            className="button button-small button-secondary"
            to={`/reconciliations/${row.id}`}
          >
            View
          </Link>
          {showReportActions && (
            <>
              <button
                className="button button-small button-secondary"
                onClick={() => onDownload(row, "xlsx")}
                disabled={downloading === `${row.id}-xlsx`}
              >
                Excel
              </button>
              <button
                className="button button-small button-secondary"
                onClick={() => onDownload(row, "csv")}
                disabled={downloading === `${row.id}-csv`}
              >
                CSV
              </button>
            </>
          )}
        </div>
      ),
    },
  ];
  return (
    <DataTable
      columns={columns}
      rows={rows || []}
      emptyTitle="No reconciliations yet"
    />
  );
}
