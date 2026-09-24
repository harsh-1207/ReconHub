function severityFor(result) {
  if (result.category === 'LINE_ITEM' && ['MISSING', 'EXTRA'].includes(result.field_name)) return 'HIGH';
  if (['total', 'subtotal', 'tax', 'amount', 'unitPrice'].includes(result.field_name)) return 'HIGH';
  return 'MEDIUM';
}

function buildExceptions(results) {
  return results
    .filter((result) => result.comparison_status === 'DIFFERENT')
    .map((result) => ({
      ...result,
      severity: severityFor(result),
      status: 'OPEN',
    }));
}

module.exports = { buildExceptions, severityFor };
