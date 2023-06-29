<script name="GlobalInfiniteScroll" setup>
/**
 * GlobalInfiniteScroll
 * @param { String | Number } width  宽度
 * @param { String | Number } height 高度
 * @param { Number }   distance    触发加载的距离阈值
 * @param { Number }   delay       节流时延，单位为ms
 * @param { Function } load        触发方法
 * @param { Boolean }  showLoading 是否展示 loading
 */
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { IconLoadingOutlined } from 'gupo-icons-vue3';

const props = defineProps({
    width: {
        type: [String, Number],
        default: '100%',
    },
    height: {
        type: [String, Number],
        default: '100%',
    },
    distance: {
        type: Number,
        default: 0,
    },
    delay: {
        type: Number,
        default: 200,
    },
    load: {
        type: Function,
        default: () => {},
    },
    showLoading: {
        type: Boolean,
        default: false,
    },
});

const infiniteScrollRef = ref();
const loading = ref(false);
const slotLoading = !!useSlots().loading;
let delayTimer;

const scrollListener = async e => {
    if (loading.value || delayTimer) return;
    if (e.target.scrollTop >= e.target.scrollHeight - e.target.clientHeight - props.distance) {
        loading.value = true;
        // 设置 loading 可见
        if (props.distance === 0 && props.showLoading) {
            await nextTick();
            e.target.scrollTop += e.target.querySelector('.gupo-infinite-scroll__loading').clientHeight;
        }
        await props.load();
        loading.value = false;
        // 设置延时
        delayTimer = setTimeout(() => {
            clearTimeout(delayTimer);
            delayTimer = null;
        }, props.delay);
    }
};

onMounted(() => {
    infiniteScrollRef.value.addEventListener('scroll', scrollListener);
});

onBeforeUnmount(() => {
    infiniteScrollRef.value.removeEventListener('scroll', scrollListener);
});
</script>

<template>
    <div
        class="gupo-infinite-scroll global-scrollbar"
        :style="{
            width: typeof width === 'string' ? width : width + 'px',
            height: typeof height === 'string' ? height : height + 'px',
        }"
        ref="infiniteScrollRef"
    >
        <div class="gupo-infinite-scroll__content">
            <slot />
            <!-- loading -->
            <div v-if="showLoading && loading" class="gupo-infinite-scroll__loading">
                <div class="default-loading" v-if="!slotLoading">加载中<IconLoadingOutlined spin /></div>
                <slot name="loading" v-else />
            </div>
            <!-- append -->
            <slot name="append" />
        </div>
    </div>
</template>

<style lang="less" scoped>
.gupo-infinite-scroll {
    &__loading {
        .default-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            line-height: 1.5;

            :deep(.gupoIcons) {
                margin-left: calc(var(--base-space) * 2);
            }
        }
    }
}
</style>
