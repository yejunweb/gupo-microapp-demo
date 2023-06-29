import { createApp } from 'vue';
import App from './App.vue';
import 'virtual:svg-icons-register'; // Here the svg sprite map has been generated
import router, { getSyncRoute } from '@src/router';
import '@src/router/routerGuard';
import store from '@src/store';
import { useStoreUser } from '@src/store/modules/user';
import { useStorePermission } from '@src/store/modules/permission';
import { setupDirectives } from '@src/directives';
import 'ant-design-vue/dist/antd.variable.min.css';
import '@src/styles/global.less';
import '@src/styles/tailwind.css';
import '@src/styles/theme/xiaoshan.less';

let app = null;

async function mount() {
    app = createApp(App);
    setupDirectives(app);
    app.use(router).use(store);
    // 路由准备就绪后挂载APP实例
    await router.isReady();
    app.mount('#child-vue3-vite', true);
    handleMicroData();
}

function unmount() {
    app.unmount();
    app = null;
    // 解绑全局数据函数
    window.eventCenterForChildVue3Vite.removeDataListener(dataListener);
    // 清空当前子应用的所有绑定函数
    window.eventCenterForChildVue3Vite.clearDataListener();
}

/** 与基座进行数据交互 */
async function handleMicroData() {
    // eventCenterForChildVue3Vite 是基座添加到 window 的数据通信对象
    if (window.eventCenterForChildVue3Vite) {
        // 主动获取基座下发的数据
        const { page, message } = window.eventCenterForChildVue3Vite.getData();
        page.forEach(({ path, ...args }) => {
            router.addRoute({
                ...getSyncRoute(path),
                ...args,
            });
        });
        const storeUser = useStoreUser();
        storeUser.setMainMessage(message);
        const storePermission = useStorePermission();
        storePermission.setHasRoute(true);
        router.replace(window.location.hash.replace(/^#/, ''));
        // 监听基座下发的数据变化
        window.eventCenterForChildVue3Vite.addDataListener(dataListener);
    }
}

/** 监听函数 */
function dataListener(data) {
    console.log('child addDataListener:', data);
    if (data.path && typeof data.path === 'string') {
        data.path = data.path.replace(/^#/, '');
        // 当基座下发path时进行跳转
        if (data.path && data.path !== router.currentRoute.value.path) {
            router.replace(data.path);
        }
    }
    if (data.message) {
        const storeUser = useStoreUser();
        storeUser.setMainMessage(data.message);
    }
}

if (window.__MICRO_APP_BASE_APPLICATION__) {
    window['micro-app-child-vue3-vite'] = { mount, unmount };
} else {
    mount();
}
