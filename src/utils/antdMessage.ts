import { message } from 'antd';

export function error(msg: string) {
  message.error(msg);
}

export function success(msg: string) {
  message.success(msg);
}