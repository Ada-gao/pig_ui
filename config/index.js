// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
// var url.BASE_API = "http://10.9.60.141:9999"
var url = require('./dev.env')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 9527,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/auth': {
        target: url.BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/auth': '/auth'
        }
      },
      '/admin': {
        target: url.BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/admin': '/admin'
        }
      },
      '/zuul': {
        target: url.BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/zuul': '/zuul'
        }
      },
      '/product': {
        target: url.BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/product': '/product'
        }
      },
      '/client': {
        target: url.BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/client': '/client'
        }
      },
      '/performance': {
        target: url.BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/performance': '/performance'
        }
      },
      '/sharing': {
        target: url.BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/sharing': '/sharing'
        }
      },
      '/activity': {
        target: url.BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/activity': '/activity'
        }
      },
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}