import viteCompression from 'vite-plugin-compression';

export const configPluginCompression = ({ VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE }) => {
    const plugins = [];
    const compressList = VITE_BUILD_COMPRESS.split(',');
    const deleteOriginFile = VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE;
    if (compressList.includes('gzip')) {
        plugins.push(
            viteCompression({
                ext: '.gz',
                deleteOriginFile,
            })
        );
    }
    if (compressList.includes('brotli')) {
        plugins.push(
            viteCompression({
                ext: '.br',
                algorithm: 'brotliCompress',
                deleteOriginFile,
            })
        );
    }
    return plugins;
};
