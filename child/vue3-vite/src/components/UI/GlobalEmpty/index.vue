<script setup>
/**  @description:空状态  **/
import empty from '@src/assets/images/empty.png';
import { GupoEmpty } from '@src/components/UI';

defineProps({
    description: {
        type: String,
        default: '暂无内容',
    },
    image: {
        type: String,
        default: empty,
    },
    imageStyle: {
        type: Object,
        default: () => ({}),
    },
});
</script>

<template>
    <div class="global-empty">
        <GupoEmpty :image="image" :image-style="imageStyle" :description="description" />
    </div>
</template>

<style lang="less" scoped>
.global-empty {
    margin: calc(var(--base-space) * 8) 0;

    :deep(.ant-empty-description) {
        color: var(--font-color-2);
    }
}
</style>
