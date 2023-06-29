<script setup>
import { reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import { get } from 'lodash-unified';
import { useStorePermission } from '@src/store/modules/permission';
import { GupoBreadcrumbItem } from '@src/components/UI';

const route = useRoute();
const storePermission = useStorePermission();

const levelList = reactive({
    data: [],
});

watch(route, () => {
    if (route.path.startsWith('/redirect/')) return;
    getBreadcrumb();
});

const getBreadcrumb = () => {
    const { meta, path } = route;
    const jRoute = {
        path: route.path,
        meta: route.meta,
        name: route.name,
        key: Math.random(),
    };
    const activeMenu = get(meta, 'activeMenu', '');
    if (activeMenu) {
        let list = loopMenu(storePermission.menuList, activeMenu) || [];
        levelList.data = list.concat([jRoute]);
    } else {
        levelList.data = loopMenu(storePermission.menuList, path) || [];
    }
};

const loopMenu = (_menuList, _activeMenu) => {
    for (let index = 0; index < _menuList.length; index++) {
        const item = _menuList[index];
        if (item.path === _activeMenu) {
            item.key = Math.random();
            return [item];
        } else {
            if (item.children && item.children.length > 0) {
                const result = loopMenu(item.children, _activeMenu);
                if (result && result.length > 0) {
                    return [item].concat(result);
                }
            }
        }
    }
};

getBreadcrumb();
</script>

<template>
    <TransitionGroup name="breadcrumb" tag="div" class="ant-breadcrumb breadcrumb box-shadow">
        <GupoBreadcrumbItem v-for="(item, index) in levelList.data" :key="item.name">
            <span v-if="index === 0">当前位置：</span>
            <span
                v-if="item.redirect === 'noRedirect' || index === levelList.data.length - 1 || !item.path || !item.component"
                :class="{ 'last-item': index === levelList.data.length - 1 }"
            >
                {{ item.title || item.meta?.title }}
            </span>
            <RouterLink v-else :to="item.path">
                {{ item.meta?.title }}
            </RouterLink>
        </GupoBreadcrumbItem>
    </TransitionGroup>
</template>

<style lang="less" scoped>
.breadcrumb {
    z-index: 2;
    width: 100%;
    height: 45px;
    padding: 0 calc(var(--base-space) * 6);
    line-height: 45px;
    background: #fff;
    box-shadow: 0 3px 3px rgba(148, 161, 196, 0.1);

    .no-redirect {
        color: #666;
        cursor: text;
    }

    a {
        &:hover {
            color: #999;
        }
    }

    .last-item {
        color: #000;
    }
}
</style>
