import { defineStore } from 'pinia';
import { useLocalStorage } from '@src/utils/storage';
import { camelCase } from 'lodash-unified';
import insertCss from '@src/utils/insert-css';
import { GupoConfigProvider } from '@src/components/UI';
import configSettings from '@src/config.json';
import { onMounted } from 'vue';

const { colorMaster: configSettingsColorMaster, fontSizeBase: configSettingsFontSizeBase, ...configSettingsRest } = configSettings;

const initTheme = {
    // 更改初始值如果发现没有生效，请清空 LocalStorage
    '--color-master-dark-1': '#0886fa',
    '--color-master': configSettingsColorMaster || '#1890ff',
    '--color-master-light-1': '#2995f8',
    '--color-master-light-2': '#63aff3',
    '--color-master-light-3': '#90c6f6',
    '--color-master-light-4': '#e6f7ff',
    '--color-success': '#67c23a',
    '--color-error': '#f56c6c',
    '--color-warning': '#faad14',
    '--color-info': '#1890ff',
    '--font-color-1': '#333',
    '--font-color-2': '#666',
    '--font-color-3': '#999',
    '--font-color-4': '#ccc',
    '--font-color-link': '#576b95',
    '--font-size-base': configSettingsFontSizeBase || '14px',
    '--font-size-footnote': 'calc(var(--font-size-base) - 4px)', // 10px
    '--font-size-tips': 'calc(var(--font-size-base) - 2px)', // 12px
    '--font-size-content': 'var(--font-size-base)', // 14px
    '--font-size-subtitle': 'calc(var(--font-size-base) + 2px)', // 16px
    '--font-size-title': 'calc(var(--font-size-base) + 4px)', // 18px
    '--font-size-headline': 'calc(var(--font-size-base) + 6px)', // 20px
    '--border-color': '#f0f0f0',
    '--background-color': '#f5f7fa',
    '--base-space': '4px',
};

const initSettings = {
    themeName: '',
    layoutType: 'left',
    siderType: 'whiteSider',
    animateType: 'fade-slide',
    showBreadcrumb: true,
    showReloadView: true,
    showSwitchOrg: true,
    showMenu: true,
    showHeader: true,
    showSetting: true,
    showFooter: true,
    ...configSettingsRest,
};

// 设置样式变量
const setCssVariable = data => {
    insertCss(
        `
:root {
${Object.keys(data)
    .map(key => {
        return `${key}: ${data[key]};\n`;
    })
    .join('')}
}`,
        {
            replace: true,
            prepend: true,
        }
    );
};

export const useStoreSetting = defineStore('settings', () => {
    const settings = useLocalStorage('settings', { ...initSettings });
    const theme = useLocalStorage('theme', { ...initTheme });
    const setTheme = data => {
        theme.value = { ...theme.value, ...data };
        // 如果是需要改变 ant 的主题色，需要调用 ConfigProvider.config
        const themeColors = {
            '--color-master': '--ant-primary-color',
            '--color-success': '--ant-success-color',
            '--color-error': '--ant-error-color',
            '--color-warning': '--ant-warning-color',
            '--color-info': '--ant-info-color',
        };
        const configColor = Object.keys(themeColors);
        if (configColor.find(v => Object.keys(data).includes(v))) {
            GupoConfigProvider.config({
                theme: Object.keys(theme.value)
                    .filter(v => configColor.includes(v))
                    .reduce((res, key) => (res[camelCase(themeColors[key].replace('ant', ''))] = theme.value[key]) && res, {}),
            });
        }
        setCssVariable(theme.value);
    };
    const setSettings = (key, value) => {
        settings.value[key] = value;
    };
    onMounted(() => {
        setTheme(theme.value);
    });
    return {
        settings,
        theme,
        setTheme,
        setSettings,
    };
});
