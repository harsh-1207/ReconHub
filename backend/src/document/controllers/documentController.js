const svc = require("../services/documentService");
const { ok } = require("../../utils/http");
const { validateUpload } = require("../validators/documentValidator");
async function upload(req, res) {
  const ext = validateUpload(req.file);
  const d = await svc.createDocument(req.file);
  const canonical = await svc.parseAndNormalize(d.id);
  ok(res, { document: d, detectedFormat: ext, canonical }, 201);
}
async function list(req, res) {
  ok(res, await svc.listDocuments());
}
async function get(req, res) {
  ok(res, await svc.getDocument(req.params.id));
}
async function items(req, res) {
  ok(res, await svc.getItems(req.params.id));
}
async function parse(req, res) {
  ok(res, await svc.parseAndNormalize(req.params.id));
}
async function canonical(req, res) {
  ok(res, await svc.getCanonicalDocument(req.params.id));
}
async function remove(req, res) {
  await svc.deleteDocument(req.params.id);
  ok(res, { deleted: true });
}
module.exports = { upload, list, get, items, parse, canonical, remove };
