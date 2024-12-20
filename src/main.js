import { createApp } from 'vue'
import App from './App.vue'

// 引入全局样式
import './global/index.css'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入路由
import router, { __useRouter, __useRoute } from './touter/index.js'

// 当前实例
const app = createApp(App);

// http请求
app.config.globalProperties.$http = {
    
}

app.config.globalProperties.$router = __useRouter();
app.config.globalProperties.$route = __useRoute();

app.use(router);
app.use(ElementPlus);
app.mount('#app')
