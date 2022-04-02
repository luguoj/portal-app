const {defineConfig} = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const {ElementPlusResolver} = require("unplugin-vue-components/resolvers")
const path = require("path");

function resolvePath(dir) {
    return path.join(__dirname, dir)
}

module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: './',
    lintOnSave: false,
    configureWebpack: {
        plugins: [
            AutoImport({
                resolvers: [ElementPlusResolver({importStyle: false})]
            }),
            Components({
                resolvers: [ElementPlusResolver()]
            })
        ]
    },
    chainWebpack: config => {
        config.resolve.alias
            .set("psr-app-context", resolvePath("src/libs/commons/app-context"))
    }
})