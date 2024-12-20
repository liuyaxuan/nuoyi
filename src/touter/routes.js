// 载入页面
import index from '@/index.vue'
import home from '@/views/home/index.vue'
import __404 from '@/views/404.vue'

// 配置路由(常量路由)
export const constantRoute = [
    {
        path: '/',
        redirect: '/index',
        component: () => index,
        name: 'Default',
        hidden: true,
    },
    {
        path: '/index',
        component: () => index,
        name: 'index',
        meta: { title: '主页', icon: 'home' },
        children: [
            {
                path: 'home',
                name: 'home',
                components: {
                    sidebar: home
                },
                meta: { title: '主页', icon: 'home' }
            },
            {
                path: '/404',
                name: '404',
                components: {
                    sidebar: __404
                },
                meta: { title: '404', icon: 'notfound' }
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
        name: 'Any',
        hidden: true,
    }
]
