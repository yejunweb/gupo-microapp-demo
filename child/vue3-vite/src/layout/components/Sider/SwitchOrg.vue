<script setup>
import { computed } from 'vue';
import { IconHomeFilled, IconSwapOutlined } from 'gupo-icons-vue3';
import { GupoTooltip, GupoDropdown, GupoMenu, GupoMenuItem } from '@src/components/UI';

const props = defineProps({
    modelValue: {
        required: true,
    },
    collapsed: {
        type: Boolean,
        default: true,
    },
    list: {
        type: Array,
        default: () => [],
    },
    labelKey: {
        type: String,
        default: 'name',
    },
    valueKey: {
        type: String,
        default: 'value',
    },
    theme: {
        type: String,
        default: 'light',
    },
});
const emit = defineEmits(['update:modelValue', 'onChange']);

const handleMenuClick = e => {
    emit('update:modelValue', e.key);
    emit('onChange', e);
};
const title = computed(() => {
    return currentItem.value[props.labelKey];
});
const currentItem = computed(() => {
    return props.list.find(v => v[props.valueKey] === props.modelValue);
});
</script>

<template>
    <div class="switch-org" :class="{ 'is-dark': theme === 'dark' }" v-show="!collapsed">
        <GupoTooltip placement="right">
            <template #title>{{ title }}</template>
            <div class="switch-org__name iconWrapper">
                <IconHomeFilled />
                <div>{{ title }}</div>
            </div>
        </GupoTooltip>
        <GupoDropdown>
            <div class="switch-org__change">
                切换机构
                <IconSwapOutlined />
            </div>
            <template #overlay>
                <GupoMenu @click="handleMenuClick" :theme="theme">
                    <GupoMenuItem v-for="item in list" :key="item[valueKey]" :disabled="item[valueKey] === props.modelValue">
                        <span>{{ item[labelKey] }}</span>
                    </GupoMenuItem>
                </GupoMenu>
            </template>
        </GupoDropdown>
    </div>
    <div class="home-icon">
        <IconHomeFilled v-show="collapsed" />
    </div>
</template>

<style lang="less" scoped>
.switch-org {
    padding: @space2 18px 0 @space6;
    overflow: hidden;
    transition: all 0.3s ease;

    &.is-dark {
        .switch-org__name {
            color: #fff;
        }
    }

    &__name {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        transition: color 0.3s ease;

        > div {
            margin-left: 10px;
            overflow: hidden;
            font-size: calc(var(--font-size-title) - 1px);
            font-weight: bold;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: opacity 0.3s ease;
        }

        &.iconWrapper :deep(.gupoIcons) {
            font-size: var(--font-size-headline);
        }
    }

    &__change {
        display: flex;
        padding-top: @space1;
        padding-left: 28px;
        overflow: hidden;
        font-size: calc(var(--font-size-content) - 1px);
        color: var(--color-master);
        white-space: nowrap;
        cursor: pointer;
        transition: opacity 0.3s ease;
        align-items: center;

        &.ant-dropdown-trigger :deep(.gupoIcons) {
            margin-left: 6px;
            font-size: var(--font-size-content);
        }
    }
}

.ant-layout-sider-collapsed .switch-org {
    height: 52px;
    padding: 0 calc(50% - 9px);
    line-height: 52px;

    &__name > div,
    &__change {
        text-align: center;
        opacity: 0;
    }
}

.home-icon {
    padding: 0 31px;
    margin: 15px 0 13px;
}

:deep(.gupoIcons-svg-HomeFilled) {
    font-size: 18px !important;
}
</style>
