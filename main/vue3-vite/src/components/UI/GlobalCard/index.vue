<script setup name="GlobalCard">
defineProps({
    title: {
        type: String,
        default: '',
    },
});
</script>

<template>
    <div class="gupo-card">
        <div class="gupo-card__title">
            <div class="title">{{ title }}</div>
            <slot name="extra" />
        </div>
        <div class="gupo-card__content">
            <slot />
        </div>
    </div>
</template>

<style lang="less" scoped>
.gupo-card {
    background: #fff;

    &__title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: calc(var(--base-space) * 4) calc(var(--base-space) * 6);
        border-bottom: 1px solid var(--border-color);

        .title {
            display: flex;
            font-size: var(--font-size-subtitle);
            font-weight: bold;
            line-height: 1;
            align-items: center;

            &::before {
                display: inline-block;
                width: 2px;
                height: 16px;
                margin-right: calc(var(--base-space) * 2);
                background: var(--color-master);
                content: '';
            }
        }
    }

    &__content {
        padding: calc(var(--base-space) * 6);
    }
}
</style>
