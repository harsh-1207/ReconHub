require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

app.get('/health', (req, res) => {
  res.json({ service: 'api-gateway', status: 'UP' });
});

function proxyAt(prefix, target) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path) => `${prefix}${path === '/' ? '' : path}`,
    on: {
      error(error, req, res) {
        if (!res.headersSent) {
          res.status(502).json({ success: false, error: { message: 'Upstream service unavailable' } });
        }
      },
    },
  });
}

app.use('/api/documents', proxyAt('/api/documents', process.env.DOCUMENT_API_URL || 'http://localhost:3001'));
app.use('/api/reconciliations', proxyAt('/api/reconciliations', process.env.RECONCILIATION_API_URL || 'http://localhost:3002'));
app.use('/api/reports', proxyAt('/api/reports', process.env.RECONCILIATION_API_URL || 'http://localhost:3002'));

app.use((req, res) => {
  res.status(404).json({ success: false, error: { message: 'Gateway route not found' } });
});

module.exports = app;
