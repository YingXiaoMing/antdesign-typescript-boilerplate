import { UserRole } from './constants';
export interface Route {
  icon?: string,
  name: string,
  children?: Route[],
  route: string,
  role?: number
}

export const RoutePath = {
  PARAMS: {
    CREATE: 'create'
  },
  ROOT: '/',
  LOGIN: '/login',
  PAGE: '/page',
  USER: '/page/user',
  TASK: '/page/task',
  RESOURCE_BATCH: '/page/resourceBatch',
  RECORD: '/page/record',
  ACTION: '/page/action',
  RESET_PWD: '/page/resetpwd'
}

const routes: Route[] = [
  {
    icon: 'user',
    name: '用户管理',
    route: RoutePath.USER,
    role: UserRole.ADMIN
  },
  {
    icon: 'bars',
    name: '任务管理',
    route: RoutePath.TASK,
    role: UserRole.ADMIN
  },
  {
    icon: 'folder',
    name: '标注批次',
    route: RoutePath.RESOURCE_BATCH,
    role: UserRole.ADMIN
  },
  {
    icon: 'file-text',
    name: '标注管理',
    route: RoutePath.RECORD
  // },
  // {
  //   icon: 'switcher',
  //   name: '操作记录',
  //   route: RoutePath.ACTION
  }
]

export { routes };