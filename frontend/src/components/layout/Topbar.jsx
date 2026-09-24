import { useLocation } from 'react-router-dom';

const titles = {
  '/': 'Dashboard',
  '/documents': 'Documents',
  '/reconcile': 'New Reconciliation',
  '/reports': 'Reports',
};

export default function Topbar() {
  const location = useLocation();
  const title = titles[location.pathname]
    || (location.pathname.startsWith('/documents/') ? 'Document Details' : null)
    || (location.pathname.startsWith('/reconciliations/') ? 'Reconciliation Details' : 'Invoice Reconciliation');

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Audit Operations</p>
        <h1>{title}</h1>
      </div>
      <div className="environment-badge">Development</div>
    </header>
  );
}
