<template>
    <div class="child-vue3-vite">
        <micro-app
            name="child-vue3-vite"
            :url="url"
            inline
            disablesandbox
            :data="microAppData"
            @created="handleCreate"
            @beforemount="handleBeforeMount"
            @mounted="handleMount"
            @unmount="handleUnmount"
            @error="handleError"
            @datachange="handleDataChange"
            destroy
        />
    </div>
</template>

<script setup>
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { EventCenterForMicroApp } from '@micro-zoe/micro-app';
const router = useRouter();
window.eventCenterForChildVue3Vite = new EventCenterForMicroApp('child-vue3-vite');

/**
 * data
 */
const url = ref('http://10.123.234.25:20001');
const microAppData = ref({
    path: '',
    page: [{ path: '/ChildVue3ViteBase' }, { path: '/ChildVue3ViteRoute' }, { path: '/ChildVue3ViteRoute/Details' }],
    message: '这是父应用（main-vue3-vite）下发的信息',
});

/**
 * methods
 */
const handleCreate = () => {
    console.log('child-vue3-vite 创建了');
};
const handleBeforeMount = () => {
    console.log('child-vue3-vite 即将被渲染');
};
const handleMount = () => {
    console.log('child-vue3-vite 已经渲染完成');
};
const handleUnmount = () => {
    console.log('child-vue3-vite 卸载了');
};
const handleError = () => {
    console.log('child-vue3-vite 加载出错了');
};
const handleDataChange = e => {
    console.log('来自 child-vue3-vite 的数据:', e.detail.data);
    const { type, data } = e.detail.data;
    if (type === 'message') return alert(data);
    if (type === 'change') return (microAppData.value = { ...microAppData.value, message: `这是父应用（main-vue3-vite）下发的信息【时间戳：${new Date()}】` });
    if (type === 'back') return router.back();
    // 子应用跳转均由基座应用进行控制
    router.push(e.detail.data);
};

/**
 * onBeforeRouteLeave
 */
onBeforeRouteLeave((to, form, next) => {
    if (to?.meta?.microApp) {
        microAppData.value = { ...microAppData.value, path: to.fullPath };
    } else {
        // 当跳转到其他非微应用页面时，即应用卸载时设置
        window.__APP_VUE3VITEBASE_HAS_APPLY__ = true;
    }
    next();
});
</script>

<style lang="less" scoped></style>
