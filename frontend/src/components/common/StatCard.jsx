export default function StatCard({ label, value, hint, tone = 'default' }) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
      {hint && <small>{hint}</small>}
    </article>
  );
}
