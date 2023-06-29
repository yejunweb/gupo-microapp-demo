<script setup>
import { computed } from 'vue';
import FullScreen from './FullScreen.vue';
// import NotifyBadge from './NotifyBadge.vue';
import ReloadView from './ReloadView.vue';
import Sider from '../Sider/index.vue';
import { useStoreUser } from '@src/store/modules/user';
import { useStoreSetting } from '@src/store/modules/setting';
import defaultAvatar from '@src/assets/images/avatar.png';
import logo from '@src/assets/images/logo.png';
import { isDdOrZzd } from '@src/utils';
import { logoutApi } from '@src/api/auth';
import { GupoAvatar, GupoDropdown, GupoLayoutHeader, gupoMessage, GupoModal } from '@src/components/UI';

const storeUser = useStoreUser();
const storeSetting = useStoreSetting();

const settings = computed(() => storeSetting.settings);
const showSider = computed(() => settings.value.layoutType === 'top' && settings.value.showMenu);
const appTitle = import.meta.env.VITE_APP_TITLE;

const logout = () => {
    GupoModal.confirm({
        title: '是否确认退出登录？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
            handelLogoutApi();
        },
    });
};

const handelLogoutApi = async () => {
    const data = await logoutApi();
    gupoMessage.success(data.message);
    storeUser.logout();
};
</script>

<template>
    <GupoLayoutHeader class="header box-shadow" :class="{ dark: settings.siderType === 'darkTop' }">
        <div class="header-left">
            <div class="header-left__logo">
                <img :src="logo" alt="logo" />
                <span>萧山</span>
            </div>
            <div class="header-left__text">{{ appTitle }}</div>
        </div>
        <div class="header-right">
            <Sider mode="horizontal" v-if="showSider" />
            <ReloadView v-if="settings.showReloadView" />
            <FullScreen />
            <!-- <NotifyBadge /> -->
            <GupoDropdown :trigger="['click']">
                <GupoAvatar :size="36">
                    <template #icon>
                        <img :src="storeUser.userInfo.img || defaultAvatar" alt="" />
                    </template>
                </GupoAvatar>
                <template #overlay>
                    <div class="user-info box-shadow">
                        <div class="user-info-desc">
                            <GupoAvatar :size="36">
                                <template #icon>
                                    <img :src="storeUser.userInfo.img || defaultAvatar" alt="" />
                                </template>
                            </GupoAvatar>
                            <div>{{ storeUser.userInfo?.name || '—' }}<br />{{ storeUser.userInfo?.phone || '—' }}</div>
                        </div>
                        <div class="user-info-menu">
                            <div>修改信息</div>
                            <div @click="logout" v-if="!isDdOrZzd()">退出登录</div>
                        </div>
                    </div>
                </template>
            </GupoDropdown>
        </div>
    </GupoLayoutHeader>
</template>

<style lang="less" scoped>
.header {
    z-index: 99;
    display: flex;
    width: 100%;
    padding: 0 20px;
    line-height: 1;
    background: #fff;
    justify-content: space-between;
    align-items: center;
    transition: background 0.3s, width 0.3s cubic-bezier(0.2, 0, 0, 1) 0s;

    &-left {
        display: flex;
        align-items: center;

        &__logo {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 198px;

            img {
                width: 120px;
            }

            span {
                display: inline-block;
                padding: 3px 8px;
                margin-right: 14px;
                color: #fff;
                background: var(--color-master);
                border-radius: 2px;
            }
        }

        &__text {
            padding: 0 14px;
            font-size: calc(var(--font-size-content) + 1px);
            border-left: 1px solid #d5d9de;
        }
    }

    &-right {
        display: flex;
        align-items: center;

        .reload-view,
        .full-screen,
        .notify-badge {
            margin-right: 20px;
        }
    }

    &.dark {
        color: #fff;
        background: #001529;
    }
}

.ant-avatar {
    background: #fff;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
}

.user-info {
    width: 200px;
    background: #fff;
    border-radius: 5px;

    &-desc {
        display: flex;
        padding: 10px 15px;
        font-size: calc(var(--font-size-subtitle) - 1px);
        align-items: center;

        .ant-avatar {
            margin-right: 15px;
        }
    }

    &-menu {
        padding: 10px 0;
        border-top: 1px solid #ebeef5;

        > div {
            padding: 0 15px;
            line-height: 2.5;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                color: var(--color-master);
                background-color: var(--ant-primary-1);
            }
        }
    }
}
</style>
