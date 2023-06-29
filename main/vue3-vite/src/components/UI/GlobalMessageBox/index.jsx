import { IconCloseOutlined } from 'gupo-icons-vue3';
import './index.less';
import { GupoButton, GupoModal } from '@src/components/UI';

/**
 * GlobalMessageBox
 * @param { Object }         props              属性
 * @param { String }         [props.type]       类型 info | success | error | warn | confirm
 * @param { String | VNode } props.title        标题
 * @param { String | VNode } props.content      内容
 * @param { String }         [props.okText]     确认按钮文字
 * @param { String }         [props.okType]     确认按钮类型
 * @param { String }         [props.cancelText] 取消按钮文字
 * @param { Boolean }        [props.showClose]  是否显示右上角关闭按钮
 * @param { String }         [props.class]      自定义类名
 * @param { VNode }          [props.operate]    自定义操作栏
 */
export const GlobalMessageBox = props => {
    return new Promise((resolve, reject) => {
        const handleConfirm = () => {
            modal.destroy();
            resolve();
        };
        const handleCancel = () => {
            modal.destroy();
            reject();
        };
        const modal = GupoModal[props.type || 'info']({
            wrapClassName: ['gupo-message-box', props.class || ''],
            title: () => (
                <div class='gupo-message-box__title'>
                    {props.title}
                    {(props.showClose || props.showClose === undefined) && <IconCloseOutlined class='title-close' onClick={handleCancel} />}
                </div>
            ),
            content: () => (
                <div class='gupo-message-box__content'>
                    <p>{props.content}</p>
                    {props.operate ? (
                        props.operate
                    ) : (
                        <div class='content-operate'>
                            {props.type === 'confirm' && (
                                <GupoButton type='info' onClick={handleCancel}>
                                    {props.cancelText || '取消'}
                                </GupoButton>
                            )}
                            <GupoButton type={props.okType || 'primary'} onClick={handleConfirm}>
                                {props.okText || '确定'}
                            </GupoButton>
                        </div>
                    )}
                </div>
            ),
        });
    });
};
