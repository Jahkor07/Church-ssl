const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 8080;

// Proxy middleware
const apiProxy = createProxyMiddleware({
  target: 'https://myrl-readaptive-dedicatorily.ngrok-free.dev',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // remove /api prefix
  },
});

// Use the proxy middleware for all requests
app.use('/api', apiProxy);

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
  console.log(`API requests will be forwarded to https://myrl-readaptive-dedicatorily.ngrok-free.dev`);
});