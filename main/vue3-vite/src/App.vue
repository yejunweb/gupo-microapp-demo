<template>
    <GupoConfigProvider :locale="zhCN">
        <router-view v-slot="{ Component }">
            <transition>
                <component :is="Component" />
            </transition>
        </router-view>
    </GupoConfigProvider>
</template>

<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useStoreSetting } from '@src/store/modules/setting';
import { GupoConfigProvider } from '@src/components/UI';

useStoreSetting();
dayjs.locale('zh-cn');
</script>
