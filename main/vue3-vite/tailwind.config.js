/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    prefix: 'tw-',
    corePlugins: {
        preflight: false,
    },
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-master)',
            },
        },
    },
};
