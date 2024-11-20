// setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://search.naver.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};