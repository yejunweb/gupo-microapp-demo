import { createHtmlPlugin } from 'vite-plugin-html';

export const configPluginHtml = (isBuild, { VITE_APP_TITLE, VITE_APP_TAG }) =>
    createHtmlPlugin({
        minify: isBuild,
        inject: {
            // Inject data into ejs template
            data: {
                title: VITE_APP_TAG + VITE_APP_TITLE,
            },
        },
    });
