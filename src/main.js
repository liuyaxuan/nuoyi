import { createApp } from 'vue'
import App from './App.vue'

// 引入全局样式
import './style/index.less'

// Element Plus
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// message
import { ElMessage } from 'element-plus'
// 引入路由
import router from './touter/index.js'

// vuex
import store from './store'

// 当前实例
const app = createApp(App);

// http请求
app.config.globalProperties.$http = {
    
}
// 将ElMessage挂载到Vue实例上
app.config.globalProperties.$message = ElMessage
// 路由
app.use(router);
// 挂载vuex store
app.use(store);
// element-plus全局注册
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
