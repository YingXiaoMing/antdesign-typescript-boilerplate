import { Modal } from 'antd';
const { confirm: confirmModal } = Modal;

export function confirm(content: React.ReactNode | string, onOk?: (func: Function) => any, onCancel?: (func: Function) => any, option?: any ) {
  confirmModal({
    title: '',
    content,
    onOk,
    onCancel,
    maskClosable: false,
    ...option
  })
}