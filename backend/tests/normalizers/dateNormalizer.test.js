const {normalizeDate}=require('../../src/document/normalizers/dateNormalizer');test('normalizes date',()=>expect(normalizeDate('2026-09-24')).toBe('2026-09-24'));
