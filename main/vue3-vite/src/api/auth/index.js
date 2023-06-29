import { request } from '@src/utils/request';
import { useStoreUser } from '@src/store/modules/user';
const userApiUrl = import.meta.env.VITE_USER_API_URL;

// 用户中心 查询账号信息
export const getUserDetail = () => {
    return request({
        baseURL: userApiUrl,
        url: '/open/user/tokenDetail',
        method: 'get',
    });
};

// 用户中心 获取用户路由权限
export const getRouterPermission = () => {
    const storeUser = useStoreUser();
    return request({
        baseURL: userApiUrl,
        url: '/open/permission/router',
        method: 'get',
        params: {
            system_code: storeUser.systemCode,
            org_id: storeUser.orgId,
        },
    });
};

// 用户中心 - 用户指定系统下机构列表（左上角）
export const userSystemOrg = () => {
    const userStore = useStoreUser();
    return request({
        baseURL: userApiUrl,
        url: '/org/user/system/org',
        method: 'get',
        params: {
            system_code: userStore.systemCode,
        },
    });
};

// 用户中心 - 退出登录
export const logoutApi = () => {
    return request({
        baseURL: userApiUrl,
        url: '/apiUser/logout',
        method: 'get',
    });
};
