<script setup>
import { GupoTooltip, GupoPopover, GupoCheckbox } from '@src/components/UI';
import { IconSettingOutlined } from 'gupo-icons-vue3';
import { computed, reactive, watch } from 'vue';

const props = defineProps({
    options: {
        type: Array,
        default: () => [],
    },
});

const emits = defineEmits(['change']);

const plainOptions = computed(() => props.options);

const defaultState = {
    indeterminate: false, //未全选显示
    checkAll: true,
    checkedList: plainOptions.value,
};

const state = reactive({ ...defaultState });

const onCheckAllChange = e => {
    Object.assign(state, {
        checkedList: e.target.checked ? plainOptions.value : [],
        indeterminate: false,
    });
};

watch(
    () => state.checkedList,
    val => {
        state.indeterminate = !!val.length && val.length < plainOptions.value.length;
        state.checkAll = val.length === plainOptions.value.length;
    }
);

const reset = () => {
    const { indeterminate, checkAll, checkedList } = defaultState;
    state.indeterminate = indeterminate;
    state.checkAll = checkAll;
    state.checkedList = checkedList;
};

watch(
    () => state.checkedList,
    () => {
        emits('change', state.checkedList);
    }
);
</script>

<template>
    <div class="column-setting">
        <GupoPopover trigger="click" placement="bottomRight">
            <template #title>
                <div class="column-setting-popover-title">
                    <GupoCheckbox v-model:checked="state.checkAll" :indeterminate="state.indeterminate" @change="onCheckAllChange"> 列展示 </GupoCheckbox>
                    <span class="global-master-color" @click="reset">重置</span>
                </div>
            </template>
            <template #content>
                <div class="column-setting-popover-group-box">
                    <GupoCheckbox.Group v-model:value="state.checkedList">
                        <div class="check-option" v-for="(item, index) in plainOptions" :key="index">
                            <GupoCheckbox :value="item">{{ item }}</GupoCheckbox>
                        </div>
                    </GupoCheckbox.Group>
                </div>
            </template>
            <GupoTooltip>
                <template #title>列设置</template>
                <IconSettingOutlined />
            </GupoTooltip>
        </GupoPopover>
    </div>
</template>

<style lang="less">
.column-setting-popover-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: @space1 0;

    .global-master-color {
        cursor: pointer;
    }
}

.column-setting-popover-group-box {
    .check-option {
        margin-bottom: @space2;
        margin-left: @space4;

        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
