const { pool } = require('../connection');

async function createReconciliation(actualId, filedId, outcome) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.query(
      `INSERT INTO reconciliations
        (actual_document_id, filed_document_id, status, match_percentage,
         total_comparisons, matched_fields, different_fields)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        actualId,
        filedId,
        outcome.status,
        outcome.matchPercentage,
        outcome.totalComparisons,
        outcome.matchedFields,
        outcome.differentFields,
      ]
    );
    const id = result.insertId;

    for (const item of outcome.results) {
      await connection.query(
        `INSERT INTO reconciliation_results
          (reconciliation_id, category, field_name, item_description, item_status,
           actual_value, filed_value, difference, comparison_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, item.category, item.field_name, item.item_description || null, item.item_status || null,
          item.actual_value, item.filed_value, item.difference, item.comparison_status,
        ]
      );
    }

    for (const item of outcome.exceptions) {
      await connection.query(
        `INSERT INTO reconciliation_exceptions
          (reconciliation_id, category, field_name, item_description, item_status,
           actual_value, filed_value, difference, severity, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, item.category, item.field_name, item.item_description || null, item.item_status || null,
          item.actual_value, item.filed_value, item.difference, item.severity, item.status,
        ]
      );
    }

    await connection.commit();
    return id;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function listReconciliations() {
  const [rows] = await pool.query(
    `SELECT r.*, a.name AS actual_document_name, f.name AS filed_document_name
       FROM reconciliations r
       JOIN documents a ON a.id = r.actual_document_id
       JOIN documents f ON f.id = r.filed_document_id
      ORDER BY r.created_at DESC`
  );
  return rows;
}

async function getDetails(id) {
  const [rows] = await pool.query(
    `SELECT r.*, a.name AS actual_document_name, f.name AS filed_document_name
       FROM reconciliations r
       JOIN documents a ON a.id = r.actual_document_id
       JOIN documents f ON f.id = r.filed_document_id
      WHERE r.id = ?`,
    [id]
  );
  if (!rows.length) return null;
  const [results] = await pool.query('SELECT * FROM reconciliation_results WHERE reconciliation_id = ? ORDER BY id', [id]);
  const [exceptions] = await pool.query('SELECT * FROM reconciliation_exceptions WHERE reconciliation_id = ? ORDER BY id', [id]);
  return { ...rows[0], results, exceptions };
}

async function getExceptions(id) {
  const [rows] = await pool.query('SELECT * FROM reconciliation_exceptions WHERE reconciliation_id = ? ORDER BY id', [id]);
  return rows;
}

async function getResults(id) {
  const [rows] = await pool.query('SELECT * FROM reconciliation_results WHERE reconciliation_id = ? ORDER BY id', [id]);
  return rows;
}

module.exports = { createReconciliation, listReconciliations, getDetails, getExceptions, getResults };
