<script setup>
/**  @description:countTo  **/
import { useTransition, TransitionPresets } from '@vueuse/core';
import { isNumber } from 'lodash';
import { computed, ref, watchEffect, onMounted, watch, unref } from 'vue';

const emits = defineEmits(['onStarted', 'onFinished']);
const props = defineProps({
    startVal: { type: Number, default: 0 }, //开始值
    endVal: { type: Number, default: 0 }, // 结束值
    duration: { type: Number, default: 1500 }, //过度时间:
    autoplay: { type: Boolean, default: true }, //是否自动开始
    // 保留几位小数
    decimals: {
        type: Number,
        default: 0,
        validator(value) {
            return value >= 0;
        },
    },
    prefix: { type: String, default: '' }, //前缀
    suffix: { type: String, default: '' }, //后缀
    separator: { type: String, default: ',' }, // 数字分隔符
    decimal: { type: String, default: '.' }, //小数点，一般不会更改
    /**
     * font color
     */
    color: { type: String },
    /**
     * Turn on digital animation
     */
    useEasing: { type: Boolean, default: true },
    /**
     * 动画类型，可选值参考https://vueuse.org/core/usetransition/#usage
     */
    transition: { type: String, default: 'linear' },
});
const source = ref(props.startVal);
const disabled = ref(false);
let outputValue = useTransition(source);
const value = computed(() => formatNumber(unref(outputValue)));

watchEffect(() => {
    source.value = props.startVal;
});
onMounted(() => {
    props.autoplay && start();
});
watch([() => props.startVal, () => props.endVal], () => {
    if (props.autoplay) {
        start();
    }
});
const start = () => {
    run();
    source.value = props.endVal;
};

const run = () => {
    outputValue = useTransition(source, {
        disabled,
        duration: props.duration,
        onFinished: () => emits('onFinished'),
        onStarted: () => emits('onStarted'),
        ...(props.useEasing ? { transition: TransitionPresets[props.transition] } : {}),
    });
};
const formatNumber = num => {
    if (!num && num !== 0) {
        return '';
    }
    const { decimals, decimal, separator, suffix, prefix } = props;
    num = Number(num).toFixed(decimals);
    num += '';
    const x = num.split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? decimal + x[1] : '';
    const rgx = /(\d+)(\d{3})/;
    if (separator && !isNumber(separator)) {
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + separator + '$2');
        }
    }
    return prefix + x1 + x2 + suffix;
};
</script>

<template>
    <span :style="{ color }" class="count-to">
        {{ value }}
    </span>
</template>
