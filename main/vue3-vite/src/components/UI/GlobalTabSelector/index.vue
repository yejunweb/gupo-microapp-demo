<script setup name="GlobalTabSelector">
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: [String, Number],
    },
    options: {
        type: Array,
        default: () => [],
    },
});
const emit = defineEmits(['update:modelValue']);

const current = ref('');

watch(
    () => props.modelValue,
    () => {
        current.value = props.modelValue;
    },
    {
        immediate: true,
    }
);

const handleClick = value => {
    current.value = value;
    emit('update:modelValue', value);
};
</script>

<template>
    <div class="gupo-tab-selector">
        <span v-for="(item, i) in props.options" :key="i" :class="{ active: current === item.value }" @click="handleClick(item.value)">
            {{ item.label }}
        </span>
    </div>
</template>

<style lang="less" scoped>
.gupo-tab-selector {
    display: flex;
    margin-right: calc(var(--base-space) * 3);

    span {
        display: inline-block;
        padding: 0 calc(var(--base-space) * 2);
        font-size: var(--font-size-content);
        line-height: 2.43;
        cursor: pointer;
        transition: color 0.3s ease;
        user-select: none;

        &.active {
            color: var(--color-master);
        }
    }
}
</style>
