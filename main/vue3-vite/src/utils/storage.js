import { createStore } from 'gupo-vue3-persistedstate';
import { isDevMode } from '@src/utils/index';

export const { useLocalStorage, useSessionStorage } = createStore(import.meta.env.VITE_APP_STORAGE_KEY, { crypto: !isDevMode() });
