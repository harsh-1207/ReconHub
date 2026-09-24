export default function ReportDownloadButtons({ reconciliationId, onDownload, busyFormat }) {
  return (
    <div className="button-group">
      <button className="button button-primary" onClick={() => onDownload('xlsx')} disabled={Boolean(busyFormat)}>
        {busyFormat === 'xlsx' ? 'Preparing Excel…' : 'Download Excel'}
      </button>
      <button className="button button-secondary" onClick={() => onDownload('csv')} disabled={Boolean(busyFormat)}>
        {busyFormat === 'csv' ? 'Preparing CSV…' : 'Download CSV'}
      </button>
      <span className="muted-text">Reconciliation #{reconciliationId}</span>
    </div>
  );
}
