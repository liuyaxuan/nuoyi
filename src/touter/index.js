// 通过vue-router插件实现模板路由配置
import { createRouter, createWebHashHistory, useRouter, useRoute } from 'vue-router'
import { constantRoute } from './routes'

// 创建路由器
let router = createRouter({
    // 路由模式hash
    history: createWebHashHistory(process.env.BASE_URL),
    routes: routerItems(),
    // 滚动行为
    scrollBehavior() {
        return {
            left: 0,
            top: 0,
        }
    },
})

// 检查路由是否存在
function isExist(routerToName, routerList) {
    return true;
}

// 路由首位
router.beforeEach((to, from, next) => {
    const routerList = routerItems(); // 获取路由列表
    const routerToName = to.name || ''; // 获取路由名称
    const routerFormName = from.name || ''; // 获取路由名称
    next()
})

export default router


export function routerItems() {
    return constantRoute || []
}

export function __useRouter() {
    return useRouter()
}

export function __useRoute() {
    return useRoute()
}