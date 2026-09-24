import { useEffect, useState } from "react";
import { reconciliationApi, reportApi } from "../services/api";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import Alert from "../components/common/Alert";
import LoadingState from "../components/common/LoadingState";
import ReconciliationTable from "../components/reconciliation/ReconciliationTable";
import { saveBlob } from "../utils/download";

export default function ReportsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    reconciliationApi
      .list()
      .then((response) => setRows(response.data.data || []))
      .catch((requestError) => setError(requestError.userMessage))
      .finally(() => setLoading(false));
  }, []);

  async function download(row, format) {
    const key = `${row.id}-${format}`;
    setDownloading(key);
    setError("");
    try {
      const response = await reportApi.download(row.id, format);
      saveBlob(response.data, `reconciliation-${row.id}.${format}`);
    } catch (requestError) {
      setError(requestError.userMessage);
    } finally {
      setDownloading("");
    }
  }

  return (
    <>
      <PageHeader
        title="Reports"
        description="Download stored reconciliation results as Excel or CSV without rerunning the engine."
      />
      {error && <Alert type="error">{error}</Alert>}
      <Card title="Available reconciliation reports">
        {loading ? (
          <LoadingState label="Loading reports…" />
        ) : (
          <ReconciliationTable
            rows={rows}
            showReportActions
            onDownload={download}
            downloading={downloading}
          />
        )}
      </Card>
    </>
  );
}
