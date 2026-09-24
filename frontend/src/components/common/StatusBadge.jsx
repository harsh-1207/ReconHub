import { titleCase } from '../../utils/formatters';

export default function StatusBadge({ value }) {
  const normalized = String(value || 'UNKNOWN').toUpperCase();
  const tone = normalized === 'MATCHED' || normalized === 'RESOLVED'
    ? 'success'
    : normalized === 'EXCEPTIONS_FOUND' || normalized === 'OPEN' || normalized === 'DIFFERENT'
      ? 'warning'
      : normalized === 'FAILED'
        ? 'danger'
        : 'neutral';
  return <span className={`status-badge status-${tone}`}>{titleCase(normalized)}</span>;
}
