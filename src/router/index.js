// 通过vue-router插件实现模板路由配置
import { createRouter, createWebHashHistory } from 'vue-router'
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
function isExist(routerToName, list) {
	let bool = false;
	list.some(route => {
		if(route.name === routerToName) {
			bool = true
		}
	});
	return bool
}

// 数组扁平化
function flattenByProperty(arr, property) {
  return arr.reduce((acc, item) => {
    acc.push(item);
    if (item[property] && Array.isArray(item[property])) {
      acc = acc.concat(flattenByProperty(item[property], property));
    } else if (item[property] && typeof item[property] === 'object') {
      acc = acc.concat(flattenByProperty([item[property]], property));
    }
    return acc;
  }, []);
}

// 路由守卫
router.beforeEach((to, from, next) => {
    const routerList = routerItems(); // 获取路由列表
    const routerToName = to.name || ''; // 获取路由名称
    const routerFormName = from.name || ''; // 获取路由名称
	if (isExist(routerToName, flattenByProperty(routerList, 'children'))) {
		if (routerToName == 'index') return next('/index/home')
		next()
	}
})

export default router


export function routerItems() {
    return constantRoute || []
}
