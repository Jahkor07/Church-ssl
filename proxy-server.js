const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 8080;

// Proxy middleware
const apiProxy = createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // remove /api prefix
  },
});

// Use the proxy middleware for all requests
app.use('/api', apiProxy);

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
  console.log(`API requests will be forwarded to http://localhost:3000`);
});