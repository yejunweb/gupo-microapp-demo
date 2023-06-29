import { visualizer } from 'rollup-plugin-visualizer';

export const configPluginVisualizer = () =>
    visualizer({
        filename: 'report.html',
        open: true,
        emitFile: true,
        gzipSize: true,
        brotliSize: true,
    });
