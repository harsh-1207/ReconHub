const {
  getCanonicalDocument,
} = require("../../document/services/documentService");
const repo = require("../../database/repositories/reconciliationRepository");
const AppError = require("../../utils/AppError");
async function reconcile(actualId, filedId) {
  if (String(actualId) === String(filedId))
    throw new AppError("Actual and filed documents must be different", 400);
  const [actual, filed] = await Promise.all([
    getCanonicalDocument(actualId),
    getCanonicalDocument(filedId),
  ]);
  if (!actual || !filed) throw new AppError("Both documents must exist", 404);
  const { reconcileDocuments } = require("../engine");
  const outcome = reconcileDocuments(actual, filed);
  const id = await repo.createReconciliation(actualId, filedId, outcome);
  return repo.getDetails(id);
}
async function list() {
  return repo.listReconciliations();
}
async function get(id) {
  const r = await repo.getDetails(id);
  if (!r) throw new AppError("Reconciliation not found", 404);
  return r;
}
async function exceptions(id) {
  const r = await repo.getDetails(id);
  if (!r) throw new AppError("Reconciliation not found", 404);
  return repo.getExceptions(id);
}
module.exports = { reconcile, list, get, exceptions };
