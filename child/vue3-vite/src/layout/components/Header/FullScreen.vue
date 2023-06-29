<script setup name="FullScreen">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { IconFullscreenOutlined, IconFullscreenExitOutlined } from 'gupo-icons-vue3';
import screenfull from 'screenfull';
import { gupoMessage } from '@src/components/UI';

const isFullScreen = ref(false);

const handleClick = () => {
    if (!screenfull.isEnabled) {
        return gupoMessage.error('您的浏览器不支持全屏');
    }
    screenfull.toggle();
};
const handleChange = () => {
    isFullScreen.value = screenfull.isFullscreen;
};

onMounted(() => {
    if (screenfull.isEnabled) {
        screenfull.on('change', handleChange);
    }
});

onBeforeUnmount(() => {
    if (screenfull.isEnabled) {
        screenfull.off('change', handleChange);
    }
});
</script>

<template>
    <div class="full-screen" @click="handleClick">
        <IconFullscreenExitOutlined v-if="isFullScreen" />
        <IconFullscreenOutlined v-else />
    </div>
</template>

<style lang="less" scoped>
.full-screen {
    font-size: 24px;
    color: var(--color-master);
    cursor: pointer;
}
</style>
