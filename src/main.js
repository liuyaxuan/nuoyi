import { createApp } from 'vue'
import App from './App.vue'

// 引入全局样式
import './global/index.css'

// Element Plus
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入路由
import router from './touter/index.js'

// 当前实例
const app = createApp(App);

// http请求
app.config.globalProperties.$http = {
    
}

app.use(router);
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
