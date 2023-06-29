import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import router from '@src/router';
import { useStoreUser } from '@src/store/modules/user';
import { useStorePermission } from '@src/store/modules/permission';

router.beforeEach(async (to, form, next) => {
    console.log('child 路由守卫', to);
    NProgress.start();
    if (!window.__MICRO_APP_BASE_APPLICATION__) {
        /**
         * 微应用环境下，路由权限由主应用下放，取消原有验证
         */
        const storeUser = useStoreUser();
        const storePermission = useStorePermission();

        storeUser.setAuth(to.query);
        if (!storePermission.hasRoute && !to.meta.whiteList) {
            const { redirectRoute } = await storePermission.initRoutes();
            return next({ ...to, replace: true, path: to.fullPath === '/' ? redirectRoute : to.fullPath });
        }
    } else {
        /**
         * 解决重新渲染子应用时，会重定向到上次离开时的最后一个页面的问题
         */
        if (window.__APP_VUE3VITEBASE_HAS_APPLY__) {
            window.__APP_VUE3VITEBASE_HAS_APPLY__ = false;
            return next({ replace: true, path: window.location.hash.replace(/^#/, '') });
        }
    }
    next();
});

router.afterEach(() => {
    NProgress.done();
});
