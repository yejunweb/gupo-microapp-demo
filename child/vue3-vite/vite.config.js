import { loadEnv, defineConfig } from 'vite';
import path from 'path';
import { writeFileSync } from 'fs';
import { wrapperEnv } from './config/utils';
import { createVitePlugins } from './config/vite/plugins';

const resolve = dir => path.resolve(__dirname, dir);

// https://vitejs.dev/config/
export default configEnv => {
    const viteEnv = wrapperEnv(loadEnv(configEnv.mode, process.cwd()));
    const { VITE_PORT, VITE_PUBLIC_PATH, VITE_DROP_CONSOLE, VITE_DROP_DEBUG, VITE_LISTEN_HTTPS } = viteEnv;
    return defineConfig({
        base: VITE_PUBLIC_PATH,
        root: process.cwd(),
        plugins: [
            ...createVitePlugins(configEnv, viteEnv),
            // 自定义插件
            (function () {
                let basePath = '';
                return {
                    name: 'vite:micro-app',
                    apply: 'build',
                    configResolved(config) {
                        basePath = `${config.base}${config.build.assetsDir}/`;
                    },
                    writeBundle(options, bundle) {
                        for (const chunkName in bundle) {
                            if (Object.prototype.hasOwnProperty.call(bundle, chunkName)) {
                                const chunk = bundle[chunkName];
                                if (chunk.fileName && chunk.fileName.endsWith('.js')) {
                                    chunk.code = chunk.code.replace(/(from|import\()(\s*['"])(\.\.?\/)/g, (all, $1, $2, $3) => {
                                        return all.replace($3, new URL($3, basePath));
                                    });
                                    const fullPath = path.join(options.dir, chunk.fileName);
                                    writeFileSync(fullPath, chunk.code);
                                }
                            }
                        }
                    },
                };
            })(),
        ],
        resolve: {
            alias: {
                '@src': resolve('./src'),
            },
        },
        esbuild: {
            pure: [VITE_DROP_CONSOLE && 'console.log', VITE_DROP_DEBUG && 'debugger'].filter(Boolean),
        },
        // https://cn.vitejs.dev/config/dep-optimization-options.html#dep-optimization-options
        optimizeDeps: {
            /**
             * 依赖预构建，vite启动时会将下面 include 里的模块，编译成 esm 格式并缓存到 node_modules/.vite 文件夹，页面加载到对应模块时如果浏览器有缓存就读取浏览器缓存，如果没有会读取本地缓存并按需加载
             * 尤其当您禁用浏览器缓存时（这种情况只应该发生在调试阶段）必须将对应模块加入到 include里，否则会遇到开发环境切换页面卡顿的问题（vite 会认为它是一个新的依赖包会重新加载并强制刷新页面），因为它既无法使用浏览器缓存，又没有在本地 node_modules/.vite 里缓存
             * 温馨提示：如果您使用的第三方库是全局引入，也就是引入到 src/main.ts 文件里，就不需要再添加到 include 里了，因为 vite 会自动将它们缓存到 node_modules/.vite
             */
            include: ['dayjs', 'ant-design-vue', 'pinia', 'lodash', 'lodash-es', 'lodash-unified', '@vueuse/core', 'axios', 'echarts'],
            exclude: [],
        },
        build: {
            target: 'es2015',
            cssTarget: 'chrome80',
            // 关掉 brotliSize 可略微减少打包时间
            // brotliSize: false,
            chunkSizeWarningLimit: 4000,
            rollupOptions: {
                // 确保外部化处理那些你不想打包进库的依赖 https://rollupjs.org/guide/en/#big-list-of-options
                external: [],
                // 静态资源分类打包
                output: {
                    manualChunks: {},
                    chunkFileNames: 'js/[name]-[hash].js',
                    entryFileNames: 'js/[name]-[hash].js',
                    assetFileNames: '[ext]/[name]-[hash].[ext]',
                },
            },
        },
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true,
                    additionalData: `@import "${path.resolve(__dirname, 'src/styles/theme/index.less')}";`,
                },
            },
        },
        server: {
            https: VITE_LISTEN_HTTPS,
            port: VITE_PORT,
            host: true,
            // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
            proxy: {},
        },
    });
};
