# Architecture

```text
React Frontend (:5173)
        |
        v
API Gateway (:3000)
   |             |
   v             v
Document API   Reconciliation API
(:3001)        (:3002)
   |             |
Parser Registry  Reconciliation Service
   |             |
Normalizer       Matching Engine
   |             |
Document Repo    Reconciliation Engine
   |             |
   +-------> MySQL <------+
                    |
              Report Service
              Excel / CSV
```

## Boundaries

- **Gateway**: single frontend entry point; no authentication or rate limiting in this version.
- **Document API**: upload validation, SHA-256 duplicate detection, parser selection, canonical normalization, MySQL persistence.
- **Parser layer**: CSV, XLS/XLSX, JSON behind `ParserRegistry` and `BaseParser`.
- **Normalizer layer**: aliases, null/string/number/date normalization, canonical invoice and item shape.
- **Matching layer**: order-independent strategies based on item code, description/quantity/price, description/price, and controlled description fallback.
- **Reconciliation engine**: compares canonical header and line-item fields only; it never checks source file type.
- **Exception service**: converts differences into persisted exceptions with severity.
- **Report service**: generates reports from stored reconciliation details, not by rerunning reconciliation.
