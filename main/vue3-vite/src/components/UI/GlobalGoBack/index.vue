<script name="GlobalGoBack" setup>
/**
 * GlobalGoBack
 * @param { Boolean } title          标题
 * @param { Boolean } showGoBack     是否展示返回按钮
 * @param { Boolean } appendToLayout 是否放入 layout
 */
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IconArrowLeftOutlined } from 'gupo-icons-vue3';
import { useStoreSetting } from '@src/store/modules/setting';

const route = useRoute();
const router = useRouter();
const storeSetting = useStoreSetting();

const display = ref(false);
const goBackRef = ref();

const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    showGoBack: {
        type: Boolean,
        default: true,
    },
    appendToLayout: {
        type: Boolean,
        default: false,
    },
    goBack: {
        type: Function,
    },
});

const handleGoBack = () => {
    if (props.goBack) return props.goBack();
    router.go(-1);
};

onMounted(() => {
    display.value = true;
    if (props.appendToLayout) {
        document.querySelector('#contentTop').appendChild(goBackRef.value);
    }
});

watch(
    () => route.path,
    () => {
        if (props.appendToLayout) {
            goBackRef.value.parentNode.removeChild(goBackRef.value);
        }
    }
);
</script>

<template>
    <Transition :name="storeSetting.settings.animateType" mode="out-in">
        <div class="gupo-go-back" v-show="display" ref="goBackRef">
            <div v-if="showGoBack" class="gupo-go-back__item" @click="handleGoBack">
                <IconArrowLeftOutlined />
                <span>{{ title || route.meta.title }}</span>
            </div>
            <slot />
        </div>
    </Transition>
</template>

<style lang="less" scoped>
.gupo-go-back {
    width: 100%;
    background: #fff;
    box-shadow: 0 5px 5px rgba(148, 161, 196, 0.1);

    &__item {
        display: inline-block;
        height: 60px;
        padding: 0 calc(var(--base-space) * 6);
        font-size: 18px;
        line-height: 60px;
        color: var(--font-color-1);
        cursor: pointer;

        span:last-child {
            margin-left: calc(var(--base-space) * 2);
        }
    }
}
</style>
