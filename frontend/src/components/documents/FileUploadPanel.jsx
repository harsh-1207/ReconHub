import { useRef, useState } from 'react';

const allowed = ['csv', 'xls', 'xlsx', 'json'];

export default function FileUploadPanel({ onUpload, busy }) {
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState('');
  const inputRef = useRef(null);

  function select(nextFile) {
    setLocalError('');
    if (!nextFile) return;
    const extension = nextFile.name.split('.').pop()?.toLowerCase();
    if (!allowed.includes(extension)) {
      setLocalError('Choose a CSV, XLS, XLSX, or JSON file.');
      setFile(null);
      return;
    }
    setFile(nextFile);
  }

  async function submit(event) {
    event.preventDefault();
    if (!file) return;
    const uploaded = await onUpload(file);
    if (uploaded) {
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <form className="upload-panel" onSubmit={submit}>
      <div className="upload-copy">
        <div className="upload-icon">↑</div>
        <div>
          <h3>Upload invoice document</h3>
          <p>Accepted formats: CSV, XLS, XLSX, JSON. Maximum size is configured by the backend.</p>
        </div>
      </div>
      <div className="upload-controls">
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xls,.xlsx,.json"
          onChange={(event) => select(event.target.files?.[0])}
        />
        <button className="button button-primary" type="submit" disabled={!file || busy}>
          {busy ? 'Uploading…' : 'Upload & normalize'}
        </button>
      </div>
      {file && <p className="selected-file">Selected: <strong>{file.name}</strong></p>}
      {localError && <p className="field-error">{localError}</p>}
    </form>
  );
}
