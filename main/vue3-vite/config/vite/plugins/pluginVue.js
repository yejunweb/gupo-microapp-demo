import vue from '@vitejs/plugin-vue';

export const configPluginVue = ({ VITE_VUE_REACTIVITY_TRANSFORM }) => vue({ reactivityTransform: VITE_VUE_REACTIVITY_TRANSFORM });
