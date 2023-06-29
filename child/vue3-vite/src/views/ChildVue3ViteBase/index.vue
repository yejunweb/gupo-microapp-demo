<template>
    <div class="container">
        <div class="container container-background">
            <GupoDivider orientation="left" :style="{ 'margin-top': 0 }">基本传参</GupoDivider>
            <GupoRow :gutter="[0, 12]">
                <GupoCol :span="24">{{ storeUser.mainMessage }}</GupoCol>
                <GupoCol :span="24">
                    <GupoButton type="primary" @click="disPatchData">点击传递参数给主应用：这是子应用（child-vue3-vite）传递的信息</GupoButton>
                </GupoCol>
                <GupoCol :span="24">
                    <GupoButton type="primary" @click="changeMainData">点击更改主应用传递的参数</GupoButton>
                </GupoCol>
            </GupoRow>
            <GupoDivider orientation="left">加载静态资源</GupoDivider>
            <img :src="backgroundUrl" :style="{ width: '700px' }" />
            <GupoButton type="primary" @click="goBack">返回</GupoButton>
        </div>
    </div>
</template>

<script setup>
import { GupoButton, GupoRow, GupoCol, GupoDivider } from '@src/components/UI/index.js';
import { useStoreUser } from '@src/store/modules/user';
import background from '@src/assets/images/background.jpg';
const storeUser = useStoreUser();
const backgroundUrl = new URL(background, import.meta.url).href;

const disPatchData = () => {
    window.eventCenterForChildVue3Vite.dispatch({ type: 'message', data: '这是子应用（child-vue3-vite）传递的信息' });
};
const changeMainData = () => {
    window.eventCenterForChildVue3Vite.dispatch({ type: 'change' });
};
const goBack = () => {
    window.eventCenterForChildVue3Vite.dispatch({ type: 'back' });
};
</script>

<style lang="less" scoped></style>
