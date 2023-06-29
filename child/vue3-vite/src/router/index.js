import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    {
        name: 'Auth',
        path: '/auth',
        component: () => import('@src/views/Auth/index.vue'),
        meta: { whiteList: true },
    },
    {
        name: '404',
        path: '/404',
        component: () => import('@src/views/Forbidden/404.vue'),
        meta: { whiteList: true },
    },
    {
        name: 'Forbidden',
        path: '/forbidden',
        component: () => import('@src/views/Forbidden/index.vue'),
        meta: { whiteList: true },
    },
    {
        name: 'Redirect',
        path: '/redirect',
        component: () => import('@src/layout/index.vue'),
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@src/layout/Redirect/index.vue'),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    // 路由切换回滚到指定位置
    scrollBehavior: () => {
        if (document.querySelector('.ant-layout-content.content')) {
            document.querySelector('.ant-layout-content.content').scrollTop = 0;
        }
    },
});

// 接入动态路由
export function getSyncRoute(path) {
    const modules = import.meta.glob('../views/**/*.vue');
    return {
        path: path.replace(/\B([A-Z])/g, '-$1').toLowerCase(),
        name: path.slice(1).replace(/\//g, '.'),
        component: modules[`../views${path}/index.vue`],
    };
}

export default router;
