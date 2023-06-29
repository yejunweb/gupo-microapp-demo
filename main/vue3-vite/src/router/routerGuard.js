import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import router from '@src/router';
import { useStoreUser } from '@src/store/modules/user';
import { useStorePermission } from '@src/store/modules/permission';

router.beforeEach(async to => {
    NProgress.start();
    const storeUser = useStoreUser();
    const storePermission = useStorePermission();

    storeUser.setAuth(to.query);
    if (!storePermission.hasRoute && !to.meta.whiteList) {
        const { redirectRoute } = await storePermission.initRoutes();
        return { ...to, replace: true, path: to.fullPath === '/' ? redirectRoute : to.fullPath };
    }
});

router.afterEach(() => {
    NProgress.done();
});
