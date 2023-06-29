import { permission } from '@src/directives/permission';
import { debounce } from '@src/directives/debounce';
import { throttle } from '@src/directives/throttle';
import { draggable } from '@src/directives/draggable';
import { longpress } from '@src/directives/longpress';

/**
 * 注册全局自定义指令
 * @param app
 */
export function setupDirectives(app) {
    // 权限控制指令
    app.directive('permission', permission(app));
    // 防抖指令
    app.directive('debounce', debounce);
    // 节流指令
    app.directive('throttle', throttle);
    // 拖拽指令
    app.directive('draggable', draggable);
    // 长按指令
    app.directive('longpress', longpress);
}
