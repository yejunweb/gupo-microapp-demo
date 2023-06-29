export const formItemProps = {
    formData: {
        type: Object,
    },
    // 左侧label展示所占col
    labelCol: {
        type: Object,
        default: () => ({
            span: 2,
        }),
    },
    // 右侧input展示所占col
    wrapperCol: {
        type: Object,
        default: () => ({}),
    },
    // 操作按钮所占col
    operationWrapperCol: {
        type: Object,
        default: () => ({}),
    },
    // 提交loading
    loading: {
        type: Boolean,
        default: () => false,
    },
    // 是否全部需要allowClear
    allowClear: {
        type: Boolean,
        default: true,
    },
};

export const formInheritEvents = ['finish', 'finishFailed', 'submit', 'validate'];

export const formItemEmits = ['cancel', 'update:formData'];
