import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "◫", end: true },
  { to: "/documents", label: "Documents", icon: "▤" },
  { to: "/reconcile", label: "Reconcile", icon: "⇄" },
  { to: "/reports", label: "Reports", icon: "▥" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src="/reconhub-logo.png" alt="ReconHub" className="brand-logo" />
      </div>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
          >
            <span className="nav-icon" aria-hidden="true">
              {link.icon}
            </span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="health-dot" />
        Local development
      </div>
    </aside>
  );
}
