<script name="GlobalTopTabs" setup>
/**
 * GlobalTopTabs
 * https://www.antdv.com/components/tabs-cn/#Tabs.TabPane
 * @param { Boolean } modelValue     当前激活 tab 面板的 key
 * @param { Array }   options        tab 面板列表
 * @param { Boolean } appendToLayout 是否放入 layout
 * @param { Boolean } forceRender    被隐藏时是否渲染 DOM 结构
 */
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { GupoTabs } from '@src/components/UI/index.js';
import { useStoreSetting } from '@src/store/modules/setting';

const props = defineProps({
    modelValue: {
        type: String || Number,
    },
    options: {
        type: Array,
        default: () => [],
    },
    appendToLayout: {
        type: Boolean,
        default: false,
    },
    forceRender: {
        type: Boolean,
        default: false,
    },
});

defineEmits(['update:modelValue']);

const storeSetting = useStoreSetting();

const topTabsRef = ref();
const display = ref(false);
const settings = computed(() => storeSetting.settings);

onMounted(() => {
    display.value = true;
    if (props.appendToLayout) {
        document.querySelector('.content-top').appendChild(topTabsRef.value);
    }
});

onBeforeUnmount(() => {
    if (props.appendToLayout) {
        topTabsRef.value.parentNode.removeChild(topTabsRef.value);
    }
});
</script>

<template>
    <Transition :name="settings.animateType" mode="out-in">
        <div class="gupo-top-tabs" v-show="display" ref="topTabsRef">
            <GupoTabs
                :activeKey="props.modelValue"
                @update:activeKey="$emit('update:modelValue', $event)"
                v-bind="{
                    ...$attrs,
                }"
            >
                <GupoTabs.TabPane v-for="{ label, name, component } in options" :key="name" :tab="label" :forceRender="forceRender">
                    <slot :name="name">
                        <component :is="component" />
                    </slot>
                </GupoTabs.TabPane>
            </GupoTabs>
            <!-- 默认插槽 -->
            <slot />
        </div>
    </Transition>
</template>

<style lang="less" scoped>
.gupo-top-tabs {
    width: 100%;

    :deep(.ant-tabs) {
        .ant-tabs-nav {
            margin-bottom: 0;
            background: #fff;

            &::before {
                display: none;
            }
        }

        .ant-tabs-nav-list {
            padding: 0 calc(var(--base-space) * 6);
        }

        .ant-tabs-tab {
            padding: calc(var(--base-space) * 4) 10px 10px;
        }
    }
}
</style>
