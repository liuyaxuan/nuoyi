const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  css: {
      loaderOptions: {
        less: {
          additionalData: `@import "~@/style/global/global.less";`,
        },
      },
    }
})
