export default function Alert({ type = "info", children, onClose }) {
  return (
    <div className={`alert alert-${type}`} role="alert">
      <span>{children}</span>
      {onClose && (
        <button className="icon-button" onClick={onClose} aria-label="Dismiss">
          ×
        </button>
      )}
    </div>
  );
}
