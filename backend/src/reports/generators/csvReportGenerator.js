const { stringify } = require('csv-stringify/sync');

function buffer(report) {
  const rows = [
    ['Invoice Reconciliation Report'],
    ['Actual Document', report.actual_document_name],
    ['Filed Document', report.filed_document_name],
    ['Status', report.status],
    ['Match Percentage', report.match_percentage],
    ['Total Comparisons', report.total_comparisons],
    ['Matched Fields', report.matched_fields],
    ['Different Fields', report.different_fields],
    [],
    ['DETAILED EXCEPTIONS'],
    ['CATEGORY', 'FIELD', 'ITEM', 'ITEM STATUS', 'ACTUAL', 'FILED', 'DIFFERENCE', 'SEVERITY', 'STATUS'],
  ];

  if (!report.exceptions.length) rows.push(['', '', '', '', '', '', '', 'No exceptions']);
  report.exceptions.forEach((item) => rows.push([
    item.category,
    item.field_name,
    item.item_description || '',
    item.item_status || '',
    item.actual_value ?? '',
    item.filed_value ?? '',
    item.difference ?? '',
    item.severity,
    item.status,
  ]));

  rows.push(
    [],
    ['ALL COMPARISONS'],
    ['CATEGORY', 'FIELD', 'ITEM', 'ITEM STATUS', 'ACTUAL', 'FILED', 'DIFFERENCE', 'RESULT']
  );

  report.results.forEach((item) => rows.push([
    item.category,
    item.field_name,
    item.item_description || '',
    item.item_status || '',
    item.actual_value ?? '',
    item.filed_value ?? '',
    item.difference ?? '',
    item.comparison_status,
  ]));

  return Buffer.from(stringify(rows));
}

module.exports = { buffer };
