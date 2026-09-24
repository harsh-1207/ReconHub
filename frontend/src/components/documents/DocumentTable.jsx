import { Link } from "react-router-dom";
import DataTable from "../common/DataTable";
import { formatBytes, formatDate } from "../../utils/formatters";

export default function DocumentTable({ documents, onDelete, deletingId }) {
  const columns = [
    { key: "id", label: "ID" },
    {
      key: "name",
      label: "Document",
      render: (value, row) => (
        <Link className="table-link" to={`/documents/${row.id}`}>
          {value}
        </Link>
      ),
    },
    {
      key: "file_type",
      label: "Format",
      render: (value) => (
        <span className="file-pill">{String(value).toUpperCase()}</span>
      ),
    },
    { key: "file_size", label: "Size", render: formatBytes },
    { key: "created_at", label: "Uploaded", render: formatDate },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="table-actions">
          <Link
            className="button button-small button-secondary"
            to={`/documents/${row.id}`}
          >
            View
          </Link>
          <button
            className="button button-small button-danger-ghost"
            onClick={() => onDelete(row)}
            disabled={deletingId === row.id}
          >
            {deletingId === row.id ? "Deleting…" : "Delete"}
          </button>
        </div>
      ),
    },
  ];
  return (
    <DataTable
      rows={documents}
      columns={columns}
      emptyTitle="No documents uploaded yet"
    />
  );
}
