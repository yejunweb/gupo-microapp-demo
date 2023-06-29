import viteLegacy from '@vitejs/plugin-legacy';

export const configPluginLegacy = () =>
    viteLegacy({
        targets: ['Chrome 63'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        modernPolyfills: true,
    });
