import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { documentApi, reconciliationApi } from "../services/api";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import Alert from "../components/common/Alert";
import LoadingState from "../components/common/LoadingState";
import ReconciliationForm from "../components/reconciliation/ReconciliationForm";

export default function ReconcilePage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    documentApi
      .list()
      .then((response) => setDocuments(response.data.data || []))
      .catch((requestError) => setError(requestError.userMessage))
      .finally(() => setLoading(false));
  }, []);

  async function run(actualId, filedId) {
    setRunning(true);
    setError("");
    try {
      const response = await reconciliationApi.create(actualId, filedId);
      navigate(`/reconciliations/${response.data.data.id}`);
    } catch (requestError) {
      setError(requestError.userMessage);
    } finally {
      setRunning(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Run reconciliation"
        description="Select two uploaded documents. Both are reconciled using their canonical representations."
      />
      {error && <Alert type="error">{error}</Alert>}
      <Card
        title="Document selection"
        subtitle="Actual is the source document; filed is the version submitted by the business."
      >
        {loading ? (
          <LoadingState label="Loading documents…" />
        ) : (
          <ReconciliationForm
            documents={documents}
            onRun={run}
            busy={running}
          />
        )}
      </Card>
      {!loading && documents.length < 2 && (
        <Alert type="info">
          Upload at least two documents before running a reconciliation.
        </Alert>
      )}
    </>
  );
}
