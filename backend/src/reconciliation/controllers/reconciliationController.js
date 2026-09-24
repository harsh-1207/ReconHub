const svc = require("../services/reconciliationService");
const { ok } = require("../../utils/http");
async function create(req, res) {
  const { actualDocumentId, filedDocumentId } = req.body || {};
  if (!actualDocumentId || !filedDocumentId)
    return res
      .status(400)
      .json({
        success: false,
        error: { message: "actualDocumentId and filedDocumentId are required" },
      });
  ok(res, await svc.reconcile(actualDocumentId, filedDocumentId), 201);
}
async function list(req, res) {
  ok(res, await svc.list());
}
async function get(req, res) {
  ok(res, await svc.get(req.params.id));
}
async function exceptions(req, res) {
  ok(res, await svc.exceptions(req.params.id));
}
module.exports = { create, list, get, exceptions };
