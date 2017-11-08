
import dva from 'dva';
import { createLogger } from 'redux-logger';
import { message } from 'antd';
import 'antd/dist/antd.less';

import router from './router';
import './style/index.less';

require('./utils/polyfill');

export const app = dva();

if (process.env.NODE_ENV !== 'production') {
  app.use({
    onAction: createLogger()
  })
}

app.router(router);
app.start('#root');