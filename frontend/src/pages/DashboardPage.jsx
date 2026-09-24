import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { documentApi, reconciliationApi } from '../services/api';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import Card from '../components/common/Card';
import LoadingState from '../components/common/LoadingState';
import Alert from '../components/common/Alert';
import ReconciliationTable from '../components/reconciliation/ReconciliationTable';

export default function DashboardPage() {
  const [documents, setDocuments] = useState([]);
  const [reconciliations, setReconciliations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([documentApi.list(), reconciliationApi.list()])
      .then(([documentsResponse, reconciliationResponse]) => {
        setDocuments(documentsResponse.data.data || []);
        setReconciliations(reconciliationResponse.data.data || []);
      })
      .catch((requestError) => setError(requestError.userMessage))
      .finally(() => setLoading(false));
  }, []);

  const metrics = useMemo(() => ({
    matched: reconciliations.filter((item) => item.status === 'MATCHED').length,
    exceptions: reconciliations.filter((item) => item.status === 'EXCEPTIONS_FOUND').length,
    averageMatch: reconciliations.length
      ? reconciliations.reduce((sum, item) => sum + Number(item.match_percentage || 0), 0) / reconciliations.length
      : 0,
  }), [reconciliations]);

  if (loading) return <LoadingState label="Loading dashboard…" />;

  return (
    <>
      <PageHeader
        title="Reconciliation overview"
        description="Track uploaded documents, reconciliation outcomes, and open differences."
        actions={<Link className="button button-primary" to="/reconcile">New reconciliation</Link>}
      />
      {error && <Alert type="error">{error}</Alert>}
      <div className="stats-grid dashboard-stats">
        <StatCard label="Documents" value={documents.length} hint="Stored in MySQL" />
        <StatCard label="Reconciliations" value={reconciliations.length} />
        <StatCard label="Matched" value={metrics.matched} tone="success" />
        <StatCard label="With exceptions" value={metrics.exceptions} tone="warning" />
      </div>
      <div className="dashboard-grid">
        <Card title="Recent reconciliations" subtitle="Latest comparison runs" actions={<Link className="text-link" to="/reports">View all</Link>}>
          <ReconciliationTable rows={reconciliations.slice(0, 6)} />
        </Card>
        <Card title="System snapshot">
          <div className="snapshot-list">
            <div><span>Average match</span><strong>{metrics.averageMatch.toFixed(2)}%</strong></div>
            <div><span>Supported formats</span><strong>CSV · XLS · XLSX · JSON</strong></div>
            <div><span>Processing</span><strong>Synchronous</strong></div>
            <div><span>Storage</span><strong>MySQL</strong></div>
          </div>
        </Card>
      </div>
    </>
  );
}
