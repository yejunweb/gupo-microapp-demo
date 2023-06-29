<template>
    <div class="container">
        <div class="container container-background">
            <GupoButton type="primary" @click="goBack">返回</GupoButton>
        </div>
    </div>
</template>

<script setup>
import { GupoButton } from '@src/components/UI/index.js';

const goBack = () => {
    window.eventCenterForChildVue3Vite.dispatch({ path: '/child-vue3-vite-route' });
};
</script>

<style lang="less" scoped></style>
