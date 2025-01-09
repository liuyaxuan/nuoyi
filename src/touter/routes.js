// 载入页面
import index from '@/index.vue'
import home from '@/views/home/index.vue'
import map from '@/views/map/index.vue'
import __404 from '@/views/404.vue'

/**
 * hidden -> 是否显示在侧边菜单栏
 * title -> 菜单栏显示的名称
 * icon -> 菜单栏显示的图标
 * components -> 菜单栏显示的组件
*/

// 配置路由(常量路由)
export const constantRoute = [
    {
        path: '/',
        redirect: '/index',
        component: index,
        name: 'default',
        hidden: true,
    },
    {
        path: '/index',
        component: index,
        name: 'index',
        meta: { title: '概览', icon: 'default' },
		hidden: false,
        children: [
            {
                path: 'home',
                name: 'home',
                icon: 'house',
                hidden: false,
                components: {
                    sidebar: home
                },
                meta: { title: '主页', icon: 'default' }
            },
            {
                path: 'leaflet',
                name: 'leaflet',
                hidden: false,
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
