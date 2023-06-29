<script setup>
import { computed } from 'vue';
import { useStoreSetting } from '@src/store/modules/setting';
import { useStorePermission } from '@src/store/modules/permission.js';
import Header from './components/Header/index.vue';
import Footer from './components/Footer.vue';
import Breadcrumb from './components/Breadcrumb.vue';
import Sider from './components/Sider/index.vue';
import { GupoLayout, GupoLayoutContent } from '@src/components/UI';

const storeSetting = useStoreSetting();
const storePermission = useStorePermission();

const settings = computed(() => storeSetting.settings);
const include = computed(() => {
    return storePermission.getKeepAliveList();
});
</script>

<template>
    <GupoLayout :class="['layout', settings.themeName]">
        <Header v-if="settings.showHeader" />
        <GupoLayout>
            <Sider v-if="settings.layoutType === 'left' && settings.showMenu" />
            <GupoLayout>
                <Breadcrumb v-if="settings.showBreadcrumb" />
                <div class="content-top" id="contentTop" />
                <GupoLayoutContent class="content">
                    <div class="main" :class="{ 'has-footer': settings.showFooter }" id="main">
                        <RouterView>
                            <template #default="{ Component }">
                                <transition :name="settings.animateType" mode="out-in">
                                    <KeepAlive :include="include">
                                        <component :is="Component" />
                                    </KeepAlive>
                                </transition>
                            </template>
                        </RouterView>
                        <Footer v-if="settings.showFooter" />
                    </div>
                </GupoLayoutContent>
            </GupoLayout>
        </GupoLayout>
    </GupoLayout>
</template>

<style lang="less" scoped>
.layout {
    width: 100%;
    height: 100vh;

    .content {
        overflow-x: hidden;
        overflow-y: auto;

        .main {
            position: relative;
            min-height: 100%;
            background-color: #f0f2f5;

            &.has-footer {
                padding-bottom: 57px;
            }

            > div:not(.footer) {
                width: 100%;
                min-height: 400px;
            }
        }
    }
}
</style>
