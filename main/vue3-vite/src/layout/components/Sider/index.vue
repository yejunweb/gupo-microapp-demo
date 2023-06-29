<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import Menu from '@src/layout/components/Sider/Menu';
import SwitchOrg from '@src/layout/components/Sider/SwitchOrg.vue';
import { uniq } from 'lodash-unified';
import { IconMenuFoldOutlined, IconMenuUnfoldOutlined } from 'gupo-icons-vue3';
import { useStorePermission } from '@src/store/modules/permission';
import { useStoreSetting } from '@src/store/modules/setting';
import { useStoreUser } from '@src/store/modules/user';
import { GupoLayoutSider, GupoMenu, gupoMessage } from '@src/components/UI';

const route = useRoute();
const storeSetting = useStoreSetting();
const storeUser = useStoreUser();
const storePermission = useStorePermission();

const settings = computed(() => storeSetting.settings);
const siderTheme = computed(() => (['darkSider', 'darkTop'].includes(settings.value.siderType) ? 'dark' : 'light'));
const siderHorizontalTheme = computed(() => (settings.value.siderType === 'darkTop' ? 'dark' : 'light'));

defineProps({
    mode: {
        type: String,
        default: 'inline',
    },
});

const orgValue = ref(storeUser.orgId);
const selectedKeys = ref([]);
const openKeys = ref([]);
const collapsed = ref(false);

const findParentValue = (array, value, valueName = 'path', childrenName = 'children') => {
    if (!value || !Array.isArray(array)) return [];
    const result = [];
    let valid = false;
    const seek = (array, value) => {
        let parentValue = '';
        const up = (array, value, lastValue) => {
            array.forEach(v => {
                const val = v[valueName];
                const child = v[childrenName];
                if (val === value) {
                    valid = true;
                    parentValue = lastValue;
                    return;
                }
                if (child && child.length) up(child, value, val);
            });
        };
        up(array, value);
        if (parentValue) {
            result.unshift(parentValue);
            seek(array, parentValue);
        }
    };
    seek(array, value);
    return valid ? result : [];
};

const onChange = async params => {
    if (params.key !== orgValue.value) {
        gupoMessage.loading('正在切换，请稍后...');
        storeUser.setOrgId(params.key);
        window.location.hash = '';
        window.location.reload();
    }
};

watch(
    () => route,
    route => {
        const { meta, path } = route;
        if (meta.activeMenu) {
            selectedKeys.value = [meta.activeMenu];
            openKeys.value = uniq([...openKeys.value, ...findParentValue(storePermission.menuList, meta.activeMenu)]);
            return;
        }
        selectedKeys.value = [path];
        openKeys.value = uniq([...openKeys.value, ...findParentValue(storePermission.menuList, path)]);
    },
    {
        deep: true,
        immediate: true,
    }
);
</script>

<template>
    <GupoLayoutSider v-if="mode === 'inline'" width="208" v-model:collapsed="collapsed" :theme="siderTheme" class="layout-sider box-shadow" collapsible>
        <SwitchOrg
            v-if="settings.showSwitchOrg && storeUser.orgListMenu?.length"
            :collapsed="collapsed"
            :list="storeUser.orgListMenu"
            :modelValue="orgValue"
            :theme="siderTheme"
            valueKey="id"
            @onChange="onChange"
        />
        <GupoMenu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" :theme="siderTheme" mode="inline">
            <Menu v-for="sider in storePermission.menuList" :key="sider.path" :data="sider" />
        </GupoMenu>
        <template #trigger>
            <div class="trigger">
                <IconMenuUnfoldOutlined v-if="collapsed" />
                <IconMenuFoldOutlined v-else />
                <span>收起菜单</span>
            </div>
        </template>
    </GupoLayoutSider>
    <div class="horizontal-header" v-if="mode === 'horizontal'">
        <GupoMenu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" :theme="siderHorizontalTheme" mode="horizontal">
            <Menu v-for="sider in storePermission.menuList" :key="sider.path" :data="sider" />
        </GupoMenu>
    </div>
</template>

<style lang="less">
.ant-layout-sider.layout-sider {
    z-index: 98;
    padding-bottom: 55px;

    .ant-menu-inline,
    .ant-menu-vertical,
    .ant-menu-vertical-left {
        border-right: none;
    }

    .ant-menu-inline .ant-menu-item,
    .ant-menu-inline .ant-menu-submenu-title {
        width: 100%;
    }

    .ant-layout-sider-children {
        padding: 10px 0;
        overflow-x: auto;

        &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background: hsla(0, 0%, 100%, 0.2);
            border-radius: 3px;
            box-shadow: inset 0 0 5px hsl(0deg 0% 100% / 5%);
        }

        &::-webkit-scrollbar-track {
            background: hsla(0, 0%, 100%, 0.15);
            border-radius: 3px;
            box-shadow: inset 0 0 5px rgb(37 37 37 / 5%);
        }

        .ant-menu-item,
        .ant-menu-submenu-title {
            height: 52px;
            padding: 0 18px;
            margin: 0;
            line-height: 52px;
            user-select: none;
        }

        .menu-item {
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .ant-menu-sub .ant-menu-item {
            padding-left: 48px;
        }

        .gupoIcon {
            font-size: 22px;
            vertical-align: -0.225em;
        }

        .ant-menu-inline-collapsed {
            & > .ant-menu-submenu > .ant-menu-submenu-title,
            & > .ant-menu-item {
                .anticon,
                .gupoIcon {
                    font-size: 22px;
                }
            }
        }
    }

    .ant-layout-sider-trigger {
        height: 55px;
        padding: 0 18px;
        overflow: hidden;
        line-height: 1;
        text-align: left;

        .trigger {
            display: flex;
            width: 100%;
            height: 100%;
            color: #999;
            border-top: 1px solid #ebeef5;
            align-items: center;

            .gupoIcons {
                font-size: 18px;
                color: var(--color-master);
            }

            span:last-child {
                margin-left: 10px;
                white-space: nowrap;
                opacity: 1;
                transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), margin 0.3s, color 0.3s;
                user-select: none;
            }
        }
    }

    &.ant-layout-sider-collapsed {
        .ant-layout-sider-children {
            .ant-menu-item,
            .ant-menu-submenu-title {
                padding: 0 calc(50% - 11px);
            }
        }

        .ant-layout-sider-trigger {
            padding: 0 32px;

            .trigger {
                span:last-child {
                    opacity: 0;
                }
            }
        }
    }
}

.ant-layout-sider.layout-sider.ant-layout-sider-light .ant-layout-sider-children {
    &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.12);
        border-radius: 3px;
        box-shadow: inset 0 0 5px rgb(0 21 41 / 5%);
    }

    &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.06);
        border-radius: 3px;
        box-shadow: inset 0 0 5px rgb(0 21 41 / 5%);
    }
}

.ant-tooltip-inner .menu-item .anticon {
    display: none;
}

.horizontal-header {
    position: relative;
    padding-right: 15px;
    margin-right: 30px;

    &::after {
        position: absolute;
        right: 0;
        bottom: 50%;
        display: inline-block;
        width: 1px;
        height: 15px;
        background: var(--border-color);
        content: '';
        transform: translateY(50%);
    }

    .ant-menu-horizontal {
        border: none;
    }

    .ant-menu-horizontal > .ant-menu-item-selected:after {
        display: none;
    }

    .ant-menu-horizontal > .ant-menu-item,
    .ant-menu-horizontal > .ant-menu-submenu {
        padding: 0 15px;
    }

    .ant-menu-horizontal > .ant-menu-item:after,
    .ant-menu-horizontal > .ant-menu-submenu:after {
        display: none;
    }

    .menu-item {
        display: flex;
        align-items: center;
        font-size: calc(var(--font-size-subtitle) - 1px);
        line-height: 64px;

        .anticon {
            font-size: 18px;
        }
    }

    .ant-menu-dark .ant-menu-submenu-selected,
    .ant-menu-dark .ant-menu-item-selected .anticon,
    .ant-menu-dark .ant-menu-item-selected .anticon + span {
        color: var(--ant-primary-color);
    }

    .ant-menu.ant-menu-dark .ant-menu-item-selected,
    .ant-menu-dark.ant-menu-horizontal > .ant-menu-item:hover {
        background: none;
    }
}

.ant-layout-sider.ant-layout-sider-dark.layout-sider .ant-layout-sider-trigger .trigger {
    border-top: none;
}
</style>
