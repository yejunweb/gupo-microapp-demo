import { configPluginVue } from './pluginVue';
import { configPluginVueJsx } from './pluginVueJsx';
import { configPluginHtml } from './vitePluginHtml';
import { configSvgIconsPlugin } from './vitePluginSvgIcons';
import { configPluginLegacy } from './vitePluginLegacy';
import { configPluginVisualizer } from './rollupPluginVisualizer';
import { configPluginCompression } from './vitePluginCompression';
import { configPluginCertificate } from './vitePluginMkcert';
import { configPluginUnpluginImport } from './unpluginAutoImport';
import { configPluginVueSetupExtend } from './vitePluginVueSetupExtend';

export const createVitePlugins = ({ command }, viteEnv) => {
    const isBuild = command === 'build';
    const lifecycle = process.env.npm_lifecycle_event;
    const { VITE_LEGACY, VITE_LISTEN_HTTPS, VITE_UNPLUGINS_IMPORTS } = viteEnv;
    // https://github.com/vitejs/awesome-vite#plugins
    // vite-plugin-pages // 自动根据目录生成路由
    const plugins = [
        configPluginVue(viteEnv),
        configPluginVueJsx(),
        configPluginVueSetupExtend(), // 支持在 setup 上使用组件 name
        configPluginHtml(isBuild, viteEnv),
        configSvgIconsPlugin(isBuild),
    ];

    if (VITE_UNPLUGINS_IMPORTS) plugins.push(configPluginUnpluginImport(viteEnv));

    if (VITE_LISTEN_HTTPS) plugins.push(configPluginCertificate());

    if (VITE_LEGACY) plugins.push(configPluginLegacy());

    if (lifecycle === 'report') {
        plugins.push(configPluginVisualizer());
    }
    if (isBuild) {
        plugins.push(configPluginCompression(viteEnv));
    }
    return plugins;
};
