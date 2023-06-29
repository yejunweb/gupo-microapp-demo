<script name="Auth" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// 跳转路由
router.replace('/');
</script>

<template>
    <div class="auth">
        <img src="../../assets/images/authLoading.gif" alt="" />
        <p>正在努力加载中</p>
    </div>
</template>

<style lang="less" scoped>
.auth {
    display: flex;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    img {
        width: 400px;
    }

    p {
        font-size: var(--font-size-title);
        color: #ccc;
    }
}
</style>
