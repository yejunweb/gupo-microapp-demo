import { defineStore } from 'pinia';
import router from '@src/router';
import Layout from '@src/layout/index.vue';
import { getRouterPermission } from '@src/api/auth';
import mockData from '@src/router/mock.json';
import { ref } from 'vue';

// 驼峰转换
const transferPascalCase2Kebabcase = str => str && str.replace(/\B([A-Z])/g, '-$1').toLowerCase();

export const useStorePermission = defineStore('permission', () => {
    const menuList = ref([]);
    const hasRoute = ref(false);
    const permission = ref({});

    const setHasRoute = value => (hasRoute.value = value);
    const setMenuList = value => (menuList.value = value);
    const setPermission = value => (permission.value = value);

    const setRoutes = menus => {
        const routes = {
            path: '/',
            name: 'layout',
            component: Layout,
            redirect: '',
            children: [],
        };
        const generateMeta = (meta = {}) => {
            return {
                ...meta,
                ...(meta?.activeMenu && {
                    activeMenu: transferPascalCase2Kebabcase(meta.activeMenu),
                }),
                showGoBack: true,
            };
        };
        const modules = import.meta.glob('../../views/**/*.vue');
        const generateRoute = item => ({
            path: transferPascalCase2Kebabcase(item.path ?? ''),
            name: item.path?.slice(1).replace(/\//g, '.'),
            meta: item.meta,
            /** 主应用改造：依据路由元信息匹配路由组件 */
            component: item.meta?.component ? modules[`../../views${item.meta.component}/index.vue`] : modules[`../../views${item.path}/index.vue`],
        });
        const generateRoutes = list => {
            const menuRouter = [];
            list.forEach(item => {
                const children = item.children && item.children.length > 0 ? generateRoutes(item.children) : [];
                const route = {
                    ...generateRoute(item),
                    children: children,
                };
                if (item.redirect) route.redirect = item.redirect;
                if (item.children?.length === 0) routes?.children?.push(route);
                menuRouter.push(route);
            });
            return menuRouter;
        };
        const menuRouter = generateRoutes(menus.router);
        const otherPageRoutes = {
            path: '/more',
            component: Layout,
            children: (menus.otherPage || []).map(item => generateRoute(item)).map(item => ({ ...item, meta: generateMeta(item.meta) })),
        };
        if (otherPageRoutes.children.length > 0) {
            // 如果有详情页的路由则加入
            router.addRoute(otherPageRoutes);
        }
        if (routes.children && routes.children.length > 0) {
            // 如果有菜单的路由则加入
            routes.redirect = routes?.children?.[0]?.path;
            router.addRoute([routes][0]);
            router.addRoute({
                path: '/:catchAll(.*)',
                redirect: { path: '/404' },
            });
            // 设置页面展示菜单数组
            setHasRoute(true);
            setMenuList(menuRouter);
        }
    };
    const initRoutes = async () => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async resolve => {
            if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
                setPermission(mockData?.button.map(item => item.path));
                setRoutes(mockData);
            } else {
                // 有接口则替换为接口返回 data 即可
                const { data } = await getRouterPermission();
                setPermission(data?.button);
                setRoutes(data);
            }

            // 返回登录成功后前往的页面地址
            resolve({ redirectRoute: menuList.value[0]?.children?.[0]?.path || menuList.value[0]?.path || '/' });
        });
    };
    const getKeepAliveName = arr => {
        let v = [];
        for (let index = 0; index < arr.length; index++) {
            const item = arr[index];
            if (item.meta.keepAlive) {
                v.push(item?.name);
            }
            if (item.children.length) {
                v.push(...getKeepAliveName(item.children));
            }
        }
        return v;
    };
    const getKeepAliveList = () => {
        return getKeepAliveName(menuList.value);
    };
    // 按钮权限判断 buttonName:Array/String
    const vPermission = buttonName => {
        let params = [].concat(buttonName);
        let resultArr = permission.value.filter(item => {
            return params.includes(item);
        });
        return !!resultArr.length;
    };
    return {
        menuList,
        hasRoute,
        permission,
        setHasRoute,
        setMenuList,
        setPermission,
        setRoutes,
        initRoutes,
        getKeepAliveList,
        vPermission,
    };
});
