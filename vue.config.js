module.exports = {
  // 打包后静态资源的位置
  publicPath: process.env.NODE_ENV !== 'production' ? '/' : '/',
  // 多页配置
  pages: {
    // 项目首页
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: '捞金',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    // 项目拓展页
    others: {
      entry: 'src/others/others.js',
      template: 'public/index.html',
      filename: 'others.html',
      title: '捞金',
      chunks: ['chunk-vendors', 'chunk-common', 'others']
    },
    // 项目后台管理系统
    system: {
      entry: 'src/system/system.js',
      template: 'public/index.html',
      filename: 'system.html',
      title: '捞金-后台管理',
      chunks: ['chunk-vendors', 'chunk-common', 'system']
    }
  }
}