export const isInterger = function isInterger(str: string) {
  return /^\+?(0|[1-9]\d*)$/.test(str);
}

export const isNumberic = function isNumberic(str: string) {
  return !isNaN(str as any) && +str >= 0;
}

export const isNDigits = function isNDigits(str: string, n: number) {
  return new RegExp(`^\\d+(\.\\d{1,${n}})?$`).test(str);
} 

export const isPhoneNumber = function isPhoneNumber(str: string) {
  return /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\d{8}$/.test(str);
}

export const isIDNumber = function isIDNumber(str: string) {
  return /^\d{15}$|^\d{17}([0-9]|X)$/.test(str);
}

export const hasLetter = function hasLetter(str: string) {
  return /[a-zA-Z]+/.test(str);
}

export const hasDigit = function hasDigit(str: string) {
  return /\d+/.test(str);
}

export const hasSpace = function hasSpace(str: string) {
  return /\s+/.test(str);
}

export const validatePwd = function validatePwd(str: string) : string {
  if (str.length < 8) {
    return '密码长度不能少于8个字符';
  } else if (str.length > 20) {
    return '密码长度不能长于20个字符';
  } else if (hasSpace(str)) {
    return '密码不允许有空格';
  } else if (!hasLetter(str) || !hasDigit(str)) {
    return '密码必须包含字母和数字';
  } else {
    return '';
  }
}