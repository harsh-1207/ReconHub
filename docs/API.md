# API Reference

Base URL through the gateway: `http://localhost:3000`

## Documents

- `POST /api/documents` — multipart form-data, field name `file`.
- `GET /api/documents`
- `GET /api/documents/:id`
- `GET /api/documents/:id/items`
- `GET /api/documents/:id/canonical`
- `POST /api/documents/:id/parse`
- `DELETE /api/documents/:id`

## Reconciliations

- `POST /api/reconciliations`

```json
{
  "actualDocumentId": 1,
  "filedDocumentId": 2
}
```

- `GET /api/reconciliations`
- `GET /api/reconciliations/:id`
- `GET /api/reconciliations/:id/exceptions`

## Reports

- `GET /api/reports/reconciliations/:id/report?format=xlsx`
- `GET /api/reports/reconciliations/:id/report?format=csv`

## Success envelope

```json
{
  "success": true,
  "data": {}
}
```

## Error envelope

```json
{
  "success": false,
  "error": {
    "message": "Readable error message"
  }
}
```
