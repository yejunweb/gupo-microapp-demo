import { defineStore } from 'pinia';
import { useLocalStorage } from '@src/utils/storage';
import { getUserDetail, userSystemOrg } from '@src/api/auth/index.js';
import { ref } from 'vue';

export const useStoreUser = defineStore('user', () => {
    const token = useLocalStorage('token', '');
    const orgId = useLocalStorage('orgId', 1);
    const systemCode = useLocalStorage('systemCode', '');
    const userInfo = ref({});
    const orgListMenu = ref([]);
    const mainMessage = ref();

    const setToken = value => (token.value = value);
    const setSystemCode = value => (systemCode.value = value);
    const setOrgId = value => (orgId.value = value);
    const setUserInfo = value => (userInfo.value = value);
    const setOrgListMenu = value => (orgListMenu.value = value);
    const setMainMessage = value => (mainMessage.value = value);

    const clearData = () => {
        token.value = '';
        systemCode.value = '';
        orgId.value = '';
    };

    // 设置用户信息
    const initUser = async () => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'false') {
            const { data } = await getUserDetail();
            setUserInfo(data);
        }
    };

    // 获取左上角切换机构
    const getUserSystemOrg = async () => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'false') {
            const { data } = await userSystemOrg();
            setOrgListMenu(data);
        }
    };

    const logout = () => {
        clearData();
        window.location.replace(import.meta.env.VITE_LOGIN_URL);
    };

    const setAuth = async query => {
        const { token: queryToken, system_code: querySystemCode, org_id: queryOrgId } = query;

        if (queryToken && queryToken !== token.value) setToken(queryToken);
        if (querySystemCode && querySystemCode !== systemCode.value) setSystemCode(querySystemCode);
        if (queryOrgId && queryOrgId !== orgId.value) setOrgId(Number(queryOrgId));
        if (!Object.keys(userInfo.value || {}).length) await initUser();
        if (!orgListMenu.value?.length) await getUserSystemOrg();
    };
    return {
        token,
        setToken,
        systemCode,
        setSystemCode,
        orgId,
        setOrgId,
        userInfo,
        orgListMenu,
        setUserInfo,
        setOrgListMenu,
        clearData,
        initUser,
        logout,
        getUserSystemOrg,
        setAuth,
        mainMessage,
        setMainMessage,
    };
});
