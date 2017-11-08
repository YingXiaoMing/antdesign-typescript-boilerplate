import env from '../../config/env';

const config = env[process.env.NODE_ENV] || env['development'];

export default {
  baseURL: config.host,
  api: {
    login: {
      submit: '/auth/login',
      ensure: '/auth'
    },
    user: {
      list: '/users/list',
      fetchById: '/users/fetchById',
      create: '/users/create',
      update: '/users/update'
    },
    task: {
      list: '/tasks/list',
      fetchById: '/tasks/fetchById',
      create: '/tasks/create',
      update: '/tasks/update'
    },
    resourceBatch: {
      files: '/resourceBatches/fileList',
      list: '/resourceBatches/list',
      fetchById: '/resourceBatches/fetchById',
      create: '/resourceBatches/create'
    },
    record: {
      list: '/records/list',
      fetchById: '/records/fetchById',
      fetchNext: '/records/fetchNext',
      update: '/records/update'
    }
  }
}