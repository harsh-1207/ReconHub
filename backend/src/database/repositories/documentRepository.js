const { pool } = require('../connection');

async function findByHash(hash) {
  const [rows] = await pool.query('SELECT id FROM documents WHERE file_hash = ?', [hash]);
  return rows[0] || null;
}

async function create(metadata) {
  const [result] = await pool.query(
    `INSERT INTO documents
      (name, type, file_type, mime_type, file_size, file_hash, raw_data)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [metadata.name, metadata.type, metadata.fileType, metadata.mimeType, metadata.fileSize, metadata.fileHash, metadata.rawData]
  );
  return result.insertId;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT id, name, type, file_type, mime_type, file_size, file_hash,
            canonical_data, created_at, updated_at
       FROM documents WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function findRawById(id) {
  const [rows] = await pool.query('SELECT id, file_type, raw_data FROM documents WHERE id = ?', [id]);
  return rows[0] || null;
}

async function findAll() {
  const [rows] = await pool.query(
    `SELECT id, name, type, file_type, mime_type, file_size, file_hash, created_at, updated_at
       FROM documents ORDER BY created_at DESC`
  );
  return rows;
}

async function replaceCanonicalData(id, canonical) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query('UPDATE documents SET canonical_data = ? WHERE id = ?', [JSON.stringify(canonical), id]);
    await connection.query('DELETE FROM document_items WHERE document_id = ?', [id]);
    for (const item of canonical.items || []) {
      await connection.query(
        `INSERT INTO document_items
          (document_id, item_code, description, quantity, unit_price, tax, amount, item_position)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, item.itemCode, item.description, item.quantity, item.unitPrice, item.tax, item.amount, item.position]
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function findItems(id) {
  const [rows] = await pool.query(
    `SELECT id, item_code, description, quantity, unit_price, tax, amount, item_position, created_at
       FROM document_items WHERE document_id = ? ORDER BY item_position, id`,
    [id]
  );
  return rows;
}

async function findReconciliationReference(id) {
  const [rows] = await pool.query(
    'SELECT id FROM reconciliations WHERE actual_document_id = ? OR filed_document_id = ? LIMIT 1',
    [id, id]
  );
  return rows[0] || null;
}

async function remove(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query('DELETE FROM document_items WHERE document_id = ?', [id]);
    await connection.query('DELETE FROM documents WHERE id = ?', [id]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  findByHash,
  create,
  findById,
  findRawById,
  findAll,
  replaceCanonicalData,
  findItems,
  findReconciliationReference,
  remove,
};
