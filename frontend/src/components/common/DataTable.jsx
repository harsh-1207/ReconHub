import EmptyState from "./EmptyState";

export default function DataTable({
  columns,
  rows,
  rowKey = "id",
  emptyTitle = "No records found",
}) {
  if (!rows?.length) return <EmptyState title={emptyTitle} />;

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row[rowKey] ?? index}>
              {columns.map((column) => (
                <td key={column.key} data-label={column.label}>
                  {column.render
                    ? column.render(row[column.key], row)
                    : (row[column.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
