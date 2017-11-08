import axios from 'axios'
import Config from './config'
import { forEach } from 'lodash'
import { routerRedux } from 'dva/router'
import { notification } from 'antd'
const Cookies = require('universal-cookie')
const cookies = new Cookies();
const qs = require('qs')

import { app } from '../index'
import { error } from '../utils/antdMessage'
import { COOKIE_NAME } from './constants';
import { NameSpaces } from '../models/nameSpaces';
import * as _ from 'lodash';

axios.defaults.baseURL = Config.baseURL
const TIMEOUT = 10000;

const getConfig = {
  method: 'get',
  timeout: TIMEOUT,
  headers: {
    'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

const postConfig = {
  method: 'post',
  timeout: TIMEOUT,
  headers: {
    'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

const postFormDataConfig = {
  method: 'post',
  timeout: TIMEOUT,
  headers: {},
  transformRequest: [(data) => {
    const formData = new FormData()
    for(const key in data) {
      formData.append(key, data[key])
    }
    return formData
  }]
}

const handleResult =  async (promise) => {
  const { data, status } = await promise;
  if (status === 200) {
    return data
  }
}

const handleError = e => {
  if (e.message === 'NoAccessToken') {
    // app['_store'].dispatch(routerRedux.push('/login'));
    return;
  }
  if (e && e.code === 'ECONNABORTED') {
    error('请求超时');
    return;
  }

  const { response } = e;
  if (response) {
    const { data, status } = response

    if (data) {
      if (data.message) {
        error(data.message);
      } else if (data.reason) {
        console.log(data.reason)
        error('请求服务器错误，请重试！')
      } else {
        error('网络错误，请重试！')
      }
    } else {
      error('网络错误，请重试！')
    }
  } else if (e.message) {
    console.log(e.message);
    error('网络错误，请重试！')
  }
}

const wrapToken = (config: any = {}, noAuth = false) => {
  const reduxState = app['_store'].getState();
  if (noAuth) {
    return config
  } else {
    const token = reduxState[NameSpaces.LOGIN].token;
    if (token) {
      return _.merge(config, { headers: { 'Access-Token': token } })
    } else {
      throw new Error('NoAccessToken');
    }
  }
}

export async function get(url: string, params?: {}, noAuth?: boolean, config?: {}) {
  try {
    return await handleResult(axios(url, { ..._.merge(wrapToken(getConfig, noAuth), config), params }))
  } catch(e) { 
    handleError(e)
  }
}

export async function post(url: string, params: {}, noAuth?: boolean, config?: {}) {
  try {
    return await handleResult(axios(url, { ..._.merge(wrapToken(postConfig, noAuth), config), params: {}, data: qs.stringify(params) }))
  } catch(e) { 
    handleError(e)
  }
}

export async function postFormData(url: string, params: {}, noAuth?: boolean, config?: {}) {
  try {
    return await handleResult(axios(url, { ..._.merge(wrapToken(postFormDataConfig, noAuth), config), params: {}, data: params }));
  } catch(e) { 
    handleError(e)
  }
}