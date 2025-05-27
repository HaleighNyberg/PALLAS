const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    historyApiFallback: true,
    port: 8080,
    host: '0.0.0.0',
    allowedHosts: 'all'
  }
})
