// vue inspect > output.js
// stylus-loader 
const path = require("path")
const resolve = dir => {
    return path.join(__dirname, dir)
  }
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/public/' : './',
    /* 输出文件目录：在npm run build时，生成文件的目录名称 */
    outputDir: 'dist',
    /* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
    assetsDir: "assets",
    /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
    productionSourceMap: false,
    /* 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存，你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变) */
    filenameHashing: false,
    lintOnSave: true,

    chainWebpack: (config) => {
        config.resolve.alias
        .set('@', resolve('src'))
        .set('components', resolve('src/components'))
        .set('common', resolve('src/common'))
        .set('pages', resolve('src/pages'))
    },
    /* webpack-dev-server 相关配置 */
    devServer: {
        /* 自动打开浏览器 */
        open: true,
        /* 设置为0.0.0.0则所有的地址均能访问 */
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        /* 使用代理 */
        proxy: {
            '/api': {
                /* 目标代理服务器地址 */
                target: 'http://localhost:3000',
                changeOrigin: true,
                // 不设置 pathRewrite 真实请求路径为 http://127.0.0.1:3000/api/student
                // 设置后 请求的真实路径不包括 api  http://127.0.0.1:3000/student
                pathRewrite: {
                    '^/api': ''

                    //http://127.0.0.1:3000/api/student
                    // '^/api': 'api/student'
                }
            },
        },
        
    },

};
