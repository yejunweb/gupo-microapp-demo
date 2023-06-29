<script setup>
import { IconSyncOutlined } from 'gupo-icons-vue3';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const handleReload = () => {
    router.push({
        path: '/redirect' + unref(route).path,
        query: route.query,
        replace: true,
    });
};
</script>

<template>
    <div class="reload-view">
        <IconSyncOutlined @click="handleReload" />
    </div>
</template>

<style lang="less" scoped>
.reload-view {
    font-size: 24px;
    color: var(--color-master);
    cursor: pointer;
}
</style>
