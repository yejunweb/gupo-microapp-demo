<script setup name="GlobalTableOptions">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import screenfull from 'screenfull';
import { IconFullscreenOutlined, IconFullscreenExitOutlined, IconReloadOutlined, IconColumnHeightOutlined } from 'gupo-icons-vue3';
import { GupoDropdown, GupoMenu, GupoTooltip } from '@src/components/UI/index.js';
import { densityData, tableOptionsProps } from '@src/components/UI/GlobalTable/utils';
import ColumnSetting from './ColumnSetting.vue';

const props = defineProps({
    ...tableOptionsProps,
});

const emits = defineEmits(['refresh', 'setDefineColumns']);

const density = ref(props.size);
const handelDensity = ({ key }) => {
    density.value = key;
};

const isFullScreen = ref(false);
// 放大
const handleFullscreen = () => {
    screenfull.toggle(props.fullscreenEl || document.getElementById('main') || document.body);
};
const handleFullscreenChange = () => {
    isFullScreen.value = screenfull.isFullscreen;
};
onMounted(() => {
    if (screenfull.isEnabled) {
        screenfull.on('change', handleFullscreenChange);
    }
});
onBeforeUnmount(() => {
    if (screenfull.isEnabled) {
        screenfull.off('change', handleFullscreenChange);
    }
});

const columnSettingOptions = computed(() => props.columns.map(item => item.title));

const hasColumns = ref(true);
const changeOption = options => {
    hasColumns.value = !!options.length;
    if (!options.length) return;
    emits(
        'setDefineColumns',
        props.columns.filter(v => options.includes(v.title))
    );
};

defineExpose({ density, hasColumns });
</script>

<template>
    <div class="globalTableOperation-icon" v-if="operation.includes('size')">
        <GupoDropdown :trigger="['click']" overlayClassName="density">
            <GupoTooltip>
                <template #title>密度</template>
                <IconColumnHeightOutlined />
            </GupoTooltip>
            <template #overlay>
                <GupoMenu @click="handelDensity">
                    <GupoMenu.Item v-for="item in densityData" :key="item.key" :class="{ active: density === item.key }">
                        <span>{{ item.name }}</span>
                    </GupoMenu.Item>
                </GupoMenu>
            </template>
        </GupoDropdown>
    </div>
    <div class="globalTableOperation-icon" @click="handleFullscreen" v-if="operation.includes('fullscreen')">
        <GupoTooltip>
            <template #title>放大</template>
            <IconFullscreenExitOutlined v-if="isFullScreen" />
            <IconFullscreenOutlined v-else />
        </GupoTooltip>
    </div>
    <div class="globalTableOperation-icon" @click="$emit('refresh')" v-if="operation.includes('reload')">
        <GupoTooltip>
            <template #title>刷新</template>
            <IconReloadOutlined />
        </GupoTooltip>
    </div>
    <div class="globalTableOperation-icon" v-if="operation.includes('setting')">
        <ColumnSetting :options="columnSettingOptions" @change="changeOption" />
    </div>
</template>

<style lang="less">
.ant-dropdown.density {
    .ant-dropdown-menu-item.active {
        background-color: var(--color-master-light-4);

        span {
            color: var(--color-master);
        }
    }
}

.globalTableOperation-icon {
    display: inline-block;
    margin: 0 @space2;

    &:last-child {
        margin-right: 0;
    }

    &:hover {
        color: var(--color-master);
    }
}
</style>
