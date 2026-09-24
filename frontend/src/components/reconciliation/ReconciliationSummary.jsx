import StatCard from '../common/StatCard';
import StatusBadge from '../common/StatusBadge';
import { formatPercent } from '../../utils/formatters';

export default function ReconciliationSummary({ reconciliation }) {
  return (
    <div className="summary-block">
      <div className="summary-status-row">
        <span>Result</span>
        <StatusBadge value={reconciliation.status} />
      </div>
      <div className="stats-grid">
        <StatCard label="Match percentage" value={formatPercent(reconciliation.match_percentage)} tone={Number(reconciliation.match_percentage) === 100 ? 'success' : 'warning'} />
        <StatCard label="Comparisons" value={reconciliation.total_comparisons ?? 0} />
        <StatCard label="Matched" value={reconciliation.matched_fields ?? 0} tone="success" />
        <StatCard label="Differences" value={reconciliation.different_fields ?? 0} tone={Number(reconciliation.different_fields) ? 'warning' : 'success'} />
      </div>
    </div>
  );
}
