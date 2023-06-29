// 密度
export const densityData = [
    {
        name: '默认',
        key: 'default',
    },
    {
        name: '中等',
        key: 'middle',
    },
    {
        name: '紧凑',
        key: 'small',
    },
];

export const tableOptionsProps = {
    operation: {
        type: Array,
        default: () => ['size', 'fullscreen', 'reload', 'setting'],
    },
    // 默认表格尺寸
    size: {
        type: String,
        default: 'default', //middle,small
    },
    columns: {
        type: Array,
        default: () => [],
        require: true,
    },
    // 需要全屏的 dom
    fullscreenEl: Object,
};
