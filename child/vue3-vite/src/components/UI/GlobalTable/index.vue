<script name="GlobalTable" setup>
import { cloneDeep, isEmpty } from 'lodash-unified';
import { reactive, ref, computed, onMounted, watch, useSlots } from 'vue';
import { IconInfoCircleFilled } from 'gupo-icons-vue3';
import { GupoTable, GupoDivider } from '@src/components/UI/index.js';
import { tableOptionsProps } from '@src/components/UI/GlobalTable/utils';
import GlobalTableOptions from '@src/components/UI/GlobalTable/Options.vue';
import { useRoute } from 'vue-router';

const emits = defineEmits(['change', 'selectedCancel', 'selected', 'selectedAll']);
const slots = useSlots();

const props = defineProps({
    ...tableOptionsProps,
    // 选择表格行所用的键
    rowKey: {
        type: String,
        default: 'key',
    },
    isTopOperation: {
        type: Boolean,
        default: true,
    },
    tableTitle: {
        type: String,
        default: '',
    },
    listApi: {
        type: Function,
        require: true,
    },
    pageNames: {
        type: Object,
        default: () => ({ page: 'page', size: 'per_page' }),
    },
    // 接口返回参数
    listApiParamsName: {
        type: Object,
        default: () => ({ list: 'list', paginate: 'paginate', total: 'total' }),
    },
    useSort: {
        type: Boolean,
        default: false,
    },
    /*
    排序的接口传参字段
        sortField（接口参数）:排序类型字段，（sortBy）
        sortOrder（接口参数）：排序筛选条件字段，（sort）
    */
    sortNames: {
        type: Object,
        default: () => ({ sortField: 'sortBy', sortOrder: 'sort' }),
    },
    /*
    	排序的默认值
        defaultField: 默认排序的关键字名，
        defaultOrder：默认排序的条件；可选值：asc，desc
    */
    sortDefaltField: {
        type: Object,
        default: () => ({ sortField: '', sortOrder: '' }),
    },
    sortOrder: {
        type: Object,
        default: () => ({ asc: 'asc', desc: 'desc' }),
    },
    // 分页的所有配置项
    pagination: {
        type: [Object, Boolean],
        default: () => ({}),
    },
    rowSelection: {
        type: [Object, Boolean],
        default: () => false,
    },
    // 隐藏整个选择展示区域
    hiddenRowSelectionArea: {
        type: Boolean,
        default: false,
    },
    // 隐藏'取消选择'
    hiddenCancelSelected: {
        type: Boolean,
        default: false,
    },
    tableHeadLeft: { type: [Function, Object] },
    selectedTip: { type: [Function, Object] },
    selectedOperation: { type: [Function, Object] },
    expandedRowRender: { type: Boolean, default: false },
    customFilterIcon: { type: Boolean, default: false },
    headerCell: { type: [Function, Object] },
    bodyCell: { type: [Function, Object] },
    title: { type: [Function, Object] },
    footer: { type: [Function, Object] },
    emptyText: { type: [Function, Object] },
    summary: { type: [Function, Object] },
    customFilterDropdown: { type: [Function, Object] },
    operationRender: { type: [Function, Object] },
});
const route = useRoute();
const $globalTable = ref();
const $globalTableOptions = ref();

const defaultMeta = {
    current_page: 1,
    per_page: props?.pagination?.defaultPageSize || 10,
};
let meta = reactive({ ...defaultMeta });

onMounted(() => {
    getList();
});

const change = (data, filters, sorter) => {
    const { current, pageSize } = data;
    meta.current_page = current;
    meta.per_page = pageSize;
    getList(sorter, filters);
    emits('change', { data, filters, sorter });
};

// 刷新 传参: 不恢复到默认页码;
const refresh = noRevertDefaultPage => {
    if (!noRevertDefaultPage) {
        const { current_page } = defaultMeta;
        meta.current_page = current_page;
    } else if (tableData.dataSource.length === 1 && meta.current_page > 1) {
        // 当删除只有最后一条数据时，并且不是最后一页，页码 -1
        meta.current_page -= 1;
    }
    getList();
};

// 设置
const _columns = ref(cloneDeep(props.columns));
watch(
    () => props.columns,
    () => {
        _columns.value = cloneDeep(props.columns);
    }
);
const defineColumns = computed(() =>
    _columns.value.map(item => {
        return {
            ...item,
            // 兼容部分人只想传 key 的情况
            dataIndex: item?.dataIndex || item.key,
            customRender:
                item.customRender ||
                (({ text: val, record: row }) => {
                    //当前单元格值 是否为 空 值
                    //判断值若为 空 则返回 '-'
                    //否则判断值若 自定义格式化 则返回自己的 setValue() 方法的返回值
                    //否则返回 prop
                    const isEmptyValue = typeof val === 'object' ? isEmpty(val) : val === '';
                    return isEmptyValue ? '—' : item.render ? item.render(val, row) : val;
                }),
        };
    })
);
const updateDefineColumns = val => {
    _columns.value = val;
};

// 反选框
const selectedData = reactive({
    rowKeys: [],
    source: [],
});

/* const selectedChange = (selectedRowKeys, selectedRows) => {
    selectedData.rowKeys = selectedRowKeys;
    selectedData.source = selectedRows;
    emits('selectChange', selectedRowKeys);
}; */
const hasSelected = computed(() => formatRowSelection.value?.selectedRowKeys.length > 0 && !props.hiddenRowSelectionArea);

// 取消选择
const selectedCancel = () => {
    selectedData.rowKeys = [];
    // emits('selectChange', []);
    emits('selectedCancel');
};

const tableData = reactive({
    dataSource: [],
    total: 0,
    loading: false,
});

// 获取接口数据
const getList = async (sorter, filters) => {
    const sorters = sorter || {
        field: props.sortDefaltField.sortField,
        order: props.sortDefaltField.sortOrder,
    };
    tableData.loading = true;
    const result = await props
        .listApi({
            [props.pageNames.page]: meta.current_page,
            [props.pageNames.size]: meta.per_page,
            ...(props.useSort && { [props.sortNames.sortField]: sorters.field, [props.sortNames.sortOrder]: props.sortOrder[sorters.order] }),
            ...filters,
        })
        .finally(() => {
            tableData.loading = false;
        });
    const { data } = result;
    // 如果源数据没有 'key'（rowKey 的默认值） 就加上
    tableData.dataSource = data[props.listApiParamsName.list].map((v, i) => ({ key: i, ...v }));
    tableData.total = data?.[props.listApiParamsName.paginate]?.[props.listApiParamsName.total];
};

const formatPagination = computed(() => {
    return props.pagination
        ? {
              total: tableData.total,
              current: meta.current_page,
              defaultPageSize: meta.per_page,
              showTotal: total => `总计${total}条`,
              'show-quick-jumper': true,
              ...props.pagination,
          }
        : props.pagination;
});

const formatRowSelection = computed(() => {
    return props.rowSelection
        ? {
              selectedRowKeys: selectedData.rowKeys,
              onSelect: (record, selected, selectedRows, nativeEvent) => {
                  if (record[props.rowKey] === undefined) {
                      throw new Error('我怀疑你的 table-rowKey 出了点问题');
                  }
                  selectedData.source = selected ? [...selectedData.source, record] : selectedData.source.filter(v => v !== record);
                  selectedData.rowKeys = selectedData.source.map(v => v[props.rowKey]);
                  emits('selected', record, selected, selectedRows, nativeEvent);
              },
              onSelectAll: (selected, selectedRows, changeRows) => {
                  if (selected && selectedRows[0][props.rowKey] === undefined) {
                      throw new Error('我怀疑你的 table-rowKey 出了点问题');
                  }
                  selectedData.source = selected ? [...selectedData.source, ...changeRows] : selectedData.source.filter(v => !changeRows.includes(v));
                  selectedData.rowKeys = selectedData.source.map(v => v[props.rowKey]);
                  emits('selectedAll', selected, selectedRows, changeRows);
              },
              ...props.rowSelection,
          }
        : undefined;
});

defineExpose({ refresh, selectedData });
</script>

<template>
    <div class="global-table" ref="$globalTable">
        <div class="top-area" v-show="isTopOperation">
            <div class="left">
                {{ tableTitle || `${route.meta.title || ''}列表` }}
                <div class="left-more">
                    <slot name="tableHeadLeft">
                        <component :is="tableHeadLeft" />
                    </slot>
                </div>
            </div>
            <div class="right">
                <slot name="operation">
                    <component :is="operationRender" />
                </slot>
                <GupoDivider type="vertical" v-if="operation.length" />
                <GlobalTableOptions
                    v-bind="Object.keys(tableOptionsProps).reduce((res, key) => Object.assign(res, { [key]: props[key] }), {})"
                    ref="$globalTableOptions"
                    :fullscreenEl="fullscreenEl || $globalTable"
                    @setDefineColumns="updateDefineColumns($event)"
                    @refresh="refresh(true)"
                />
            </div>
        </div>
        <!-- 选择区域 -->
        <div class="selected" v-show="hasSelected">
            <div class="selected-left">
                <IconInfoCircleFilled />
                <span class="selected-num">
                    已选择 <span class="global-master-color">{{ formatRowSelection?.selectedRowKeys?.length }}</span> 项
                </span>
                <span class="tip">
                    <slot name="selected-tip">
                        <component :is="selectedTip" />
                    </slot>
                </span>
            </div>
            <div class="selected-right">
                <span v-if="!hiddenCancelSelected" class="global-master-color" @click="selectedCancel">取消选择</span>
                <!-- selectedCancel: 取消选择； item：选中行-->
                <slot name="selected-operation" :selectedCancel="selectedCancel" :item="selectedData">
                    <component :is="selectedOperation" :selectedCancel="selectedCancel" :item="selectedData" />
                </slot>
            </div>
        </div>
        <!-- 表格区域-->
        <div id="global-table">
            <GupoTable
                :scroll="{ x: 1300 }"
                v-bind="$attrs"
                :rowKey="rowKey"
                :row-selection="formatRowSelection"
                :dataSource="tableData.dataSource"
                :columns="defineColumns"
                :pagination="formatPagination"
                @change="change"
                :size="$globalTableOptions?.density"
                :loading="tableData.loading"
                v-show="$globalTableOptions?.hasColumns"
            >
                <template #headerCell="{ title, column }">
                    <slot name="headerCell" :column="column" :title="title">
                        <component :is="headerCell" :column="column" :title="title" />
                    </slot>
                </template>
                <template #bodyCell="{ text, record, index, column }">
                    <slot name="bodyCell" :column="column" :text="text" :index="index" :record="record">
                        <component :is="bodyCell" :column="column" :text="text" :index="index" :record="record" />
                    </slot>
                </template>
                <template #title v-if="title || !!slots?.title">
                    <slot name="title">
                        <component :is="title" />
                    </slot>
                </template>
                <template #footer v-if="footer || !!slots?.footer">
                    <slot name="footer">
                        <component :is="footer" />
                    </slot>
                </template>
                <template #summary v-if="summary || !!slots?.summary">
                    <slot name="summary">
                        <component :is="summary" />
                    </slot>
                </template>
                <template #emptyText v-if="emptyText || !!slots?.emptyText">
                    <slot name="emptyText">
                        <component :is="emptyText" />
                    </slot>
                </template>
                <template #expandedRowRender v-if="expandedRowRender || !!slots?.expandedRowRender">
                    <slot name="expandedRowRender">
                        <component :is="expandedRowRender" />
                    </slot>
                </template>
                <template
                    #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                    v-if="customFilterDropdown || !!slots?.customFilterDropdown"
                >
                    <slot
                        name="customFilterDropdown"
                        :setSelectedKeys="setSelectedKeys"
                        :selectedKeys="selectedKeys"
                        :confirm="confirm"
                        :clearFilters="clearFilters"
                        :column="column"
                    >
                        <component
                            :is="customFilterDropdown"
                            :setSelectedKeys="setSelectedKeys"
                            :selectedKeys="selectedKeys"
                            :confirm="confirm"
                            :clearFilters="clearFilters"
                            :column="column"
                        />
                    </slot>
                </template>
                <template #customFilterIcon="{ filtered, column }" v-if="customFilterIcon || !!slots?.customFilterIcon">
                    <slot name="customFilterIcon" :filtered="filtered" :column="column">
                        <component :is="customFilterIcon" :filtered="filtered" :column="column" />
                    </slot>
                </template>
            </GupoTable>
        </div>
    </div>
</template>

<style lang="less" scoped>
.global-table {
    padding: @space6 @space8 @space6;
    background-color: #fff;
    box-shadow: 0 0 15px rgba(148, 161, 196, 0.25);

    .top-area {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: @space4;

        .left {
            display: flex;
            font-size: var(--font-size-subtitle);

            &-more {
                margin-left: @space5;
            }
        }
    }

    .selected {
        display: flex;
        padding: @space3 @space4;
        margin-bottom: @space4;
        font-size: var(--font-size-content);
        background-color: var(--color-master-light-4);
        border: 1px solid var(--color-master-light-3);
        justify-content: space-between;
        align-items: center;

        .selected-left {
            .gupoIcons {
                margin-right: @space2;
                color: var(--color-master);
            }

            span.global-master-color {
                font-weight: bold;
            }

            .tip {
                margin-left: @space5;
            }
        }

        .selected-right {
            display: flex;

            span {
                margin-left: @space5;
                cursor: pointer;
            }
        }
    }

    #global-table {
        background-color: #fff;
    }

    :deep(.ant-table) {
        .ant-table-thead > tr > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan]):before {
            display: none;
        }
    }

    :deep(.ant-pagination) {
        margin-bottom: 0;
    }
}
</style>
