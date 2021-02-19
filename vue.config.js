module.exports = {
  // 打包后静态资源的位置
  publicPath: process.env.NODE_ENV === 'production' ? '/production-sub-path/' : '/',
  // 多页配置
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: '捞金',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    others: {
      entry: 'src/others/others.js',
      template: 'public/others.html',
      filename: 'others.html',
      title: '捞金',
      chunks: ['chunk-vendors', 'chunk-common', 'others']
    }
  }
}