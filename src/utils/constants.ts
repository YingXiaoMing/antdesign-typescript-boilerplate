export const UserRole = {
  ADMIN: 1,
  ANNOTATOR: 2
}

export const UserRoleMap = {
  [UserRole.ADMIN]: '管理员',
  [UserRole.ANNOTATOR]: '标注员'
}

export const TaskType = {
  CLASSIFICATION: 1
  // SEGMENTATION: 2
}

export const TaskTypeMap = {
  [TaskType.CLASSIFICATION]: '分类'
  // [TaskType.SEGMENTATION]: '分割'
}

export const TaskClassificationType = {
  SINGLE: 1,
  MULTIPLE: 2    
}

export const TaskClassificationTypeMap = {
  [TaskClassificationType.SINGLE]: '单选',
  [TaskClassificationType.MULTIPLE]: '多选'
}

export const COOKIE_NAME = {
  TOKEN: 'access-token'
}

export const PAGE_SIZE = 15