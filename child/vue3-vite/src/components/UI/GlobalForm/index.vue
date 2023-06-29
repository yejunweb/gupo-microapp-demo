<script setup>
/**  @description:form封装

 支持类型
 input, input.password, input.textarea,
 inputNumber, 它不属于antd input组件下，是单独的一个组件，所以不写成input.number
 select, 新增了showSearch（搜索）属性，
 checkbox,
 radio,
 switch,
 datePicker, datePicker.rangePicker,
 timePicker, timePicker.timeRangePicker,
 rate,
 slider,
 cascader, 新增了showSearch（搜索）属性，
 treeSelect,
 upload, upload.dragger


 props参数除了formItemProps和props.showSearch其余和antd文档相同
 举例配置项：
 itemConfigs:[
 {
            key: 'key',
            label: '输入框',
            type: 'select',
            props:{
                showSearch:true,
                options:[]
            },
            // 配置Form.Item，这个配置项用的比较少
            formItemProps: {
                labelAlign: 'right',
            },
        },
 ]

 tips：
 1、select和treeSelect 在单选的时候定义参数写成undefined,否则placeholder不显示。
 2、当select和treeSelect自定义后缀失效的时候可能是开了多选或者checkable导致。
 3、触发自己的方法(例如select的change事件),在props传on+事件名(onChange)
 * **/
import { ref, computed, reactive } from 'vue';
import { GupoForm } from '@src/components/UI';
import { formInheritEvents, formItemEmits, formItemProps } from '@src/components/UI/GlobalForm/utils';
import GlobalFormItem from '@src/components/UI/GlobalForm/Item.vue';

const props = defineProps({
    ...formItemProps,
    itemConfigs: {
        type: Array,
        default: () => {
            return [];
        },
    },
    rules: {
        type: Object,
        default: () => ({}),
    },
});
const emits = defineEmits([...formInheritEvents, ...formItemEmits]);

const $formRef = ref();

const _formData = reactive(
    // 初始化 formItem 每一项数据，默认值为 undefined
    props.itemConfigs.reduce((res, cur) => {
        res[cur.key] = undefined;
        return res;
    }, {})
);
const formDataValue = computed(() => props.formData || _formData);
const updateValue = data => {
    if (props.formData) {
        emits('update:formData', { ...props.formData, ...data });
    } else {
        Object.assign(_formData, data);
    }
};

// 原 Form 组件的一些内置方法导出
const clearValidate = (...e) => $formRef.value.clearValidate(...e);
const getFieldsValue = (...e) => $formRef.value.getFieldsValue(...e);
const resetFields = (...e) => $formRef.value.resetFields(...e);
const scrollToField = (...e) => $formRef.value.scrollToField(...e);
const validate = (...e) => $formRef.value.validate(...e);
const validateFields = (...e) => $formRef.value.validateFields(...e);

defineExpose({ clearValidate, getFieldsValue, resetFields, scrollToField, validate, validateFields });
</script>

<template>
    <div>
        <GupoForm
            ref="$formRef"
            :labelWrap="true"
            :model="formDataValue"
            :rules="rules"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            v-on="formInheritEvents.reduce((events, eventName) => (events[eventName] = (...event) => emits(eventName, ...event)) && events, {})"
            v-bind="$attrs"
        >
            <GlobalFormItem
                v-for="(item, index) in itemConfigs"
                :key="index"
                :item="item"
                v-bind="Object.keys(formItemProps).reduce((res, key) => Object.assign(res, { [key]: props[key] }), {})"
                :formData="formDataValue"
                @update:formData="updateValue"
                @cancel="$emit('cancel', formDataValue)"
            />
            <slot name="footer" :data="formDataValue" />
        </GupoForm>
    </div>
</template>

<style lang="less" scoped></style>
