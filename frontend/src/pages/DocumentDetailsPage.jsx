import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { documentApi } from "../services/api";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import Alert from "../components/common/Alert";
import LoadingState from "../components/common/LoadingState";
import CanonicalInvoiceView from "../components/documents/CanonicalInvoiceView";
import { formatBytes, formatDate, valueOrDash } from "../utils/formatters";

export default function DocumentDetailsPage() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [canonical, setCanonical] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reparsing, setReparsing] = useState(false);

  async function load() {
    try {
      const [documentResponse, canonicalResponse] = await Promise.all([
        documentApi.get(id),
        documentApi.canonical(id),
      ]);
      setDocument(documentResponse.data.data);
      setCanonical(canonicalResponse.data.data);
    } catch (requestError) {
      setError(requestError.userMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function reparse() {
    setReparsing(true);
    setError("");
    try {
      const response = await documentApi.parse(id);
      setCanonical(response.data.data);
    } catch (requestError) {
      setError(requestError.userMessage);
    } finally {
      setReparsing(false);
    }
  }

  if (loading) return <LoadingState label="Loading document…" />;
  if (!document)
    return <Alert type="error">{error || "Document not found."}</Alert>;

  return (
    <>
      <PageHeader
        title={document.name}
        description={`Document #${document.id}`}
        actions={
          <>
            <Link className="button button-secondary" to="/documents">
              Back
            </Link>
            <button
              className="button button-primary"
              onClick={reparse}
              disabled={reparsing}
            >
              {reparsing ? "Reparsing…" : "Reparse"}
            </button>
          </>
        }
      />
      {error && <Alert type="error">{error}</Alert>}
      <Card title="Document metadata">
        <dl className="detail-grid">
          <div>
            <dt>File type</dt>
            <dd>{String(document.file_type).toUpperCase()}</dd>
          </div>
          <div>
            <dt>MIME type</dt>
            <dd>{valueOrDash(document.mime_type)}</dd>
          </div>
          <div>
            <dt>File size</dt>
            <dd>{formatBytes(document.file_size)}</dd>
          </div>
          <div>
            <dt>Uploaded</dt>
            <dd>{formatDate(document.created_at)}</dd>
          </div>
          <div className="detail-span-2">
            <dt>SHA-256</dt>
            <dd className="mono wrap-anywhere">{document.file_hash}</dd>
          </div>
        </dl>
      </Card>
      <CanonicalInvoiceView invoice={canonical} />
    </>
  );
}
