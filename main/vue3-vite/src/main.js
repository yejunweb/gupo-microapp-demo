import { createApp } from 'vue';
import App from './App.vue';
import 'virtual:svg-icons-register'; // Here the svg sprite map has been generated
import router from '@src/router';
import '@src/router/routerGuard';
import store from '@src/store';
import { setupDirectives } from '@src/directives';
import 'ant-design-vue/dist/antd.variable.min.css';
import '@src/styles/global.less';
import '@src/styles/tailwind.css';
import '@src/styles/theme/xiaoshan.less';

/** 主应用改造：引入 micro-app */
import microApp from '@micro-zoe/micro-app';
microApp.start({
    plugins: {
        modules: {
            'child-vue3-vite': [
                {
                    loader(code) {
                        // 这里 /basename/ 需要和子应用vite.config.js中base的配置保持一致
                        code = code.replace(/(from|import)(\s*['"])(\/)/g, all => {
                            return all.replace('/', 'http://10.123.234.25:20001/');
                        });
                        return code;
                    },
                },
            ],
        },
    },
});

const app = createApp(App);

setupDirectives(app);

app.use(router).use(store).mount('#app');
