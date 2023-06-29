<script name="Forbidden" setup>
import { GupoResult } from '@src/components/UI/index';
import { useRoute } from 'vue-router';

/**  @description:
 * 1、钉钉、浙政钉环境登录失效（401）是跳转到此页面（正常pc环境是退出到登录页面）；
 * 2、无权限访问；
 * 3、未注册提示联系管理员注册（412）
 * **/

const route = useRoute();
const code = route.query?.code;

const msg = {
    412: {
        title: '暂未注册',
        subTitle: '您账号尚未注册，请联系管理员注册',
    },
    401: {
        title: '登录过期',
        subTitle: '登录失效，请重新登录',
    },
};
</script>

<template>
    <div class="forbidden">
        <GupoResult status="500" :title="msg[code]?.title" :sub-title="msg[code]?.subTitle" />
    </div>
</template>

<style lang="less" scoped>
.forbidden {
    position: relative;
    height: 100vh;

    :deep(.ant-result) {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>
