import { useCallback, useEffect, useState } from "react";
import { documentApi } from "../services/api";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import Alert from "../components/common/Alert";
import LoadingState from "../components/common/LoadingState";
import FileUploadPanel from "../components/documents/FileUploadPanel";
import DocumentTable from "../components/documents/DocumentTable";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState(null);

  const load = useCallback(async () => {
    try {
      const response = await documentApi.list();
      setDocuments(response.data.data || []);
    } catch (error) {
      setMessage({ type: "error", text: error.userMessage });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function upload(file) {
    setUploading(true);
    setMessage(null);
    try {
      const response = await documentApi.upload(file);
      setMessage({
        type: "success",
        text: `${response.data.data.document.name} uploaded, parsed, and normalized.`,
      });
      await load();
      return true;
    } catch (error) {
      setMessage({ type: "error", text: error.userMessage });
      return false;
    } finally {
      setUploading(false);
    }
  }

  async function remove(document) {
    if (
      !window.confirm(
        `Delete "${document.name}"? This is blocked if the document is already used by a reconciliation.`,
      )
    )
      return;
    setDeletingId(document.id);
    setMessage(null);
    try {
      await documentApi.remove(document.id);
      setMessage({ type: "success", text: "Document deleted." });
      await load();
    } catch (error) {
      setMessage({ type: "error", text: error.userMessage });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Documents"
        description="Upload source invoices and inspect the canonical data produced by the parser and normalizer."
      />
      {message && (
        <Alert type={message.type} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}
      <Card>
        <FileUploadPanel onUpload={upload} busy={uploading} />
      </Card>
      <Card title={`Uploaded documents (${documents.length})`}>
        {loading ? (
          <LoadingState label="Loading documents…" />
        ) : (
          <DocumentTable
            documents={documents}
            onDelete={remove}
            deletingId={deletingId}
          />
        )}
      </Card>
    </>
  );
}
