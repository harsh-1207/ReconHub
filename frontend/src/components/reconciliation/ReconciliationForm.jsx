import { useMemo, useState } from 'react';

export default function ReconciliationForm({ documents, onRun, busy }) {
  const [actualId, setActualId] = useState('');
  const [filedId, setFiledId] = useState('');
  const canSubmit = actualId && filedId && actualId !== filedId && !busy;
  const actualDocument = useMemo(() => documents.find((item) => String(item.id) === String(actualId)), [documents, actualId]);
  const filedDocument = useMemo(() => documents.find((item) => String(item.id) === String(filedId)), [documents, filedId]);

  async function submit(event) {
    event.preventDefault();
    if (!canSubmit) return;
    await onRun(actualId, filedId);
  }

  return (
    <form className="reconciliation-form" onSubmit={submit}>
      <div className="compare-grid">
        <label className="field">
          <span>Actual document</span>
          <select value={actualId} onChange={(event) => setActualId(event.target.value)}>
            <option value="">Select actual document</option>
            {documents.map((document) => <option key={document.id} value={document.id}>#{document.id} — {document.name}</option>)}
          </select>
          {actualDocument && <small>{String(actualDocument.file_type).toUpperCase()} document</small>}
        </label>
        <div className="compare-arrow" aria-hidden="true">⇄</div>
        <label className="field">
          <span>Filed document</span>
          <select value={filedId} onChange={(event) => setFiledId(event.target.value)}>
            <option value="">Select filed document</option>
            {documents.map((document) => <option key={document.id} value={document.id}>#{document.id} — {document.name}</option>)}
          </select>
          {filedDocument && <small>{String(filedDocument.file_type).toUpperCase()} document</small>}
        </label>
      </div>
      {actualId && filedId && actualId === filedId && <p className="field-error">Select two different documents.</p>}
      <div className="form-footer">
        <p>The engine compares canonical header fields and order-independent line items.</p>
        <button className="button button-primary" type="submit" disabled={!canSubmit}>{busy ? 'Reconciling…' : 'Run reconciliation'}</button>
      </div>
    </form>
  );
}
