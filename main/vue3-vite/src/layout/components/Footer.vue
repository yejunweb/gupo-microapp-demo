<script setup>
import FooterLogo from '@src/assets/images/footer_logo.png';
</script>

<template>
    <div class="footer">
        <div>
            <img :src="FooterLogo" alt="logo" />
            <span>健康大脑 · 萧山</span>
        </div>
        <div>
            <span>古珀医疗科技有限公司出品</span>
        </div>
    </div>
</template>

<style lang="less" scoped>
.footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding-bottom: @space4;
    font-size: var(--font-size-tips);
    line-height: 1.5;
    color: var(--font-color-2);
    text-align: center;

    img {
        width: 15px;
        margin-right: var(--base-space);
    }

    div:first-child {
        margin-bottom: @space1;
    }
}
</style>
