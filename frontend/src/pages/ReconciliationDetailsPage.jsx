import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { reconciliationApi, reportApi } from '../services/api';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Alert from '../components/common/Alert';
import LoadingState from '../components/common/LoadingState';
import ReconciliationSummary from '../components/reconciliation/ReconciliationSummary';
import ExceptionsTable from '../components/reconciliation/ExceptionsTable';
import ComparisonResultsTable from '../components/reconciliation/ComparisonResultsTable';
import ReportDownloadButtons from '../components/reports/ReportDownloadButtons';
import { formatDate } from '../utils/formatters';
import { saveBlob } from '../utils/download';

export default function ReconciliationDetailsPage() {
  const { id } = useParams();
  const [reconciliation, setReconciliation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyFormat, setBusyFormat] = useState('');

  useEffect(() => {
    reconciliationApi.get(id)
      .then((response) => setReconciliation(response.data.data))
      .catch((requestError) => setError(requestError.userMessage))
      .finally(() => setLoading(false));
  }, [id]);

  async function download(format) {
    setBusyFormat(format);
    setError('');
    try {
      const response = await reportApi.download(id, format);
      saveBlob(response.data, `reconciliation-${id}.${format}`);
    } catch (requestError) {
      setError(requestError.userMessage);
    } finally {
      setBusyFormat('');
    }
  }

  if (loading) return <LoadingState label="Loading reconciliation…" />;
  if (!reconciliation) return <Alert type="error">{error || 'Reconciliation not found.'}</Alert>;

  return (
    <>
      <PageHeader
        title={`Reconciliation #${reconciliation.id}`}
        description={`Created ${formatDate(reconciliation.created_at)}`}
        actions={<Link className="button button-secondary" to="/reports">All reports</Link>}
      />
      {error && <Alert type="error">{error}</Alert>}
      <Card>
        <div className="document-pair">
          <div><span>Actual</span><strong>{reconciliation.actual_document_name}</strong></div>
          <div className="pair-arrow">→</div>
          <div><span>Filed</span><strong>{reconciliation.filed_document_name}</strong></div>
        </div>
        <ReconciliationSummary reconciliation={reconciliation} />
        <ReportDownloadButtons reconciliationId={reconciliation.id} onDownload={download} busyFormat={busyFormat} />
      </Card>
      <Card title={`Exceptions (${reconciliation.exceptions?.length || 0})`} subtitle="Only mismatched fields and missing/extra line items appear here.">
        <ExceptionsTable rows={reconciliation.exceptions} />
      </Card>
      <Card title={`All comparisons (${reconciliation.results?.length || 0})`} subtitle="Deterministic comparison results stored for this reconciliation.">
        <ComparisonResultsTable rows={reconciliation.results} />
      </Card>
    </>
  );
}
