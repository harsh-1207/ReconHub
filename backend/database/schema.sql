CREATE DATABASE IF NOT EXISTS invoice_reconciliation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE invoice_reconciliation;

CREATE TABLE IF NOT EXISTS documents (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(255) NOT NULL,
 type VARCHAR(50) NOT NULL,
 file_type VARCHAR(20) NOT NULL,
 mime_type VARCHAR(120),
 file_size BIGINT UNSIGNED NOT NULL,
 file_hash CHAR(64) NOT NULL UNIQUE,
 raw_data LONGBLOB NOT NULL,
 canonical_data JSON NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 INDEX idx_documents_created_at(created_at), INDEX idx_documents_file_type(file_type)
);
CREATE TABLE IF NOT EXISTS document_items (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 document_id BIGINT UNSIGNED NOT NULL,
 item_code VARCHAR(150),
 description VARCHAR(500),
 quantity DECIMAL(18,6),
 unit_price DECIMAL(18,4),
 tax DECIMAL(18,4),
 amount DECIMAL(18,4),
 item_position INT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_document_items_document FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE RESTRICT,
 INDEX idx_document_items_document(document_id)
);
CREATE TABLE IF NOT EXISTS reconciliations (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 actual_document_id BIGINT UNSIGNED NOT NULL,
 filed_document_id BIGINT UNSIGNED NOT NULL,
 status ENUM('MATCHED','EXCEPTIONS_FOUND','FAILED') NOT NULL,
 match_percentage DECIMAL(7,2) DEFAULT 0,
 total_comparisons INT DEFAULT 0,
 matched_fields INT DEFAULT 0,
 different_fields INT DEFAULT 0,
 error_message TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 CONSTRAINT fk_recon_actual FOREIGN KEY(actual_document_id) REFERENCES documents(id) ON DELETE RESTRICT,
 CONSTRAINT fk_recon_filed FOREIGN KEY(filed_document_id) REFERENCES documents(id) ON DELETE RESTRICT,
 INDEX idx_recon_created_at(created_at)
);
CREATE TABLE IF NOT EXISTS reconciliation_results (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 reconciliation_id BIGINT UNSIGNED NOT NULL,
 category ENUM('HEADER','LINE_ITEM') NOT NULL,
 field_name VARCHAR(100) NOT NULL,
 item_description VARCHAR(500),
 item_status ENUM('MATCHED','MODIFIED','MISSING','EXTRA') NULL,
 actual_value TEXT,
 filed_value TEXT,
 difference TEXT,
 comparison_status ENUM('MATCHED','DIFFERENT') NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_results_recon FOREIGN KEY(reconciliation_id) REFERENCES reconciliations(id) ON DELETE CASCADE,
 INDEX idx_results_recon(reconciliation_id)
);
CREATE TABLE IF NOT EXISTS reconciliation_exceptions (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 reconciliation_id BIGINT UNSIGNED NOT NULL,
 category ENUM('HEADER','LINE_ITEM') NOT NULL,
 field_name VARCHAR(100) NOT NULL,
 item_description VARCHAR(500),
 item_status ENUM('MATCHED','MODIFIED','MISSING','EXTRA') NULL,
 actual_value TEXT,
 filed_value TEXT,
 difference TEXT,
 severity ENUM('LOW','MEDIUM','HIGH') NOT NULL DEFAULT 'MEDIUM',
 status ENUM('OPEN','RESOLVED') NOT NULL DEFAULT 'OPEN',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_exceptions_recon FOREIGN KEY(reconciliation_id) REFERENCES reconciliations(id) ON DELETE CASCADE,
 INDEX idx_exceptions_recon(reconciliation_id)
);
