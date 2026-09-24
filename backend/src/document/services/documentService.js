const crypto = require('crypto');
const path = require('path');
const ParserRegistry = require('../parsers');
const { normalizeRows } = require('../normalizers');
const repository = require('../../database/repositories/documentRepository');
const AppError = require('../../utils/AppError');

function detectFileType(name) {
  return path.extname(name).slice(1).toLowerCase();
}

function parseCanonicalJson(document) {
  if (document?.canonical_data && typeof document.canonical_data === 'string') {
    document.canonical_data = JSON.parse(document.canonical_data);
  }
  return document;
}

async function createDocument(file, type = 'INVOICE') {
  const fileType = detectFileType(file.originalname);
  const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
  const duplicate = await repository.findByHash(fileHash);
  if (duplicate) throw new AppError(`Duplicate document. Existing document id: ${duplicate.id}`, 409);

  const id = await repository.create({
    name: file.originalname,
    type,
    fileType,
    mimeType: file.mimetype,
    fileSize: file.size,
    fileHash,
    rawData: file.buffer,
  });
  return getDocument(id);
}

async function parseAndNormalize(id) {
  const document = await repository.findRawById(id);
  if (!document) throw new AppError('Document not found', 404);
  const parser = ParserRegistry.get(document.file_type);
  const parsedRows = parser.parse(document.raw_data);
  const canonical = normalizeRows(parsedRows);
  await repository.replaceCanonicalData(id, canonical);
  return canonical;
}

async function getDocument(id) {
  const document = await repository.findById(id);
  if (!document) throw new AppError('Document not found', 404);
  return parseCanonicalJson(document);
}

async function listDocuments() {
  return repository.findAll();
}

async function getItems(id) {
  await getDocument(id);
  return repository.findItems(id);
}

async function getCanonicalDocument(id) {
  let document = await getDocument(id);
  if (!document.canonical_data) {
    await parseAndNormalize(id);
    document = await getDocument(id);
  }
  return document.canonical_data;
}

async function deleteDocument(id) {
  await getDocument(id);
  const reference = await repository.findReconciliationReference(id);
  if (reference) throw new AppError('Document is referenced by a reconciliation and cannot be deleted', 409);
  await repository.remove(id);
  return true;
}

module.exports = {
  createDocument,
  parseAndNormalize,
  getDocument,
  listDocuments,
  getItems,
  getCanonicalDocument,
  deleteDocument,
};
