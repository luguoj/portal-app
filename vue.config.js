const {defineConfig} = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const {ElementPlusResolver} = require("unplugin-vue-components/resolvers")

module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: './',
    lintOnSave: true,
    configureWebpack: {
        plugins: [
            AutoImport({
                resolvers: [ElementPlusResolver({importStyle: false})]
            }),
            Components({
                resolvers: [ElementPlusResolver()]
            })
        ]
    }
})