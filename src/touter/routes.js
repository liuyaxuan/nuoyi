// 载入页面
import index from '@/index.vue'
import home from '@/views/home/index.vue'
import map from '@/views/map/index.vue'
import __404 from '@/views/404.vue'

// 配置路由(常量路由)
export const constantRoute = [
    {
        path: '/',
        redirect: '/index',
        component: index,
        name: 'Default',
        hidden: true,
    },
    {
        path: '/index',
        component: index,
        name: 'index',
        meta: { title: '概览', icon: 'default' },
        children: [
            {
                path: 'home',
                name: 'home',
                icon: 'house',
                components: {
                    sidebar: home
                },
                meta: { title: '主页', icon: 'default' }
            },
            {
                path: 'leaflet',
                name: 'leaflet',
                components: {
                    sidebar: map
                },
                meta: { title: 'leaflet', icon: 'default' }
            },
            {
                path: '/404',
                name: '404',
                hidden: true,
                components: {
                    sidebar: __404
                },
                meta: { title: '404', icon: 'default' }
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
