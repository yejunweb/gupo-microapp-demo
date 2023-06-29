<template>
    <div class="container">
        <div class="container container-background">
            <GupoButton type="primary" @click="linkToDetails">点击跳转子应用详情页</GupoButton>
        </div>
    </div>
</template>

<script setup>
import { GupoButton } from '@src/components/UI/index.js';

const linkToDetails = () => {
    window.eventCenterForChildVue3Vite.dispatch({ path: '/child-vue3-vite-route/details' });
};
</script>

<style lang="scss" scoped></style>
