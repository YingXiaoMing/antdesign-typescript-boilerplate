import * as _ from "lodash";
import * as moment from 'moment';
import { PAGE_SIZE } from './constants';

export const array2Map = function array2Map(array: Array<any>, key, field): any {
  return _.reduce(array, (result, item: any) => {
    result[item[key]] = field ? item[field]: item;
    return result;
  }, {})
}

export const obj2Field = function obj2Field(obj: object): any {
  const fields = {}
  if (obj) {
    _.forIn(obj, (v, k) => {
      if (v != null) {
        if (typeof v === 'object' || typeof v === 'number') {
          fields[k] = { value: v }
        } else {
          fields[k] = { value: v.toString() }
        }
      }
    })
  }
  return fields
}

export const formatDateString = function formatDateString(date: Date, format: string = 'YYYY-MM-DD HH:mm:ss'): any {
   return date ? moment(date).format(format) : '';
}

export const getBase64 = function getBase64(img: File): Promise<any> {
  return new Promise((resolve, reject) => {
    if (img.type.match(/image.*/) || /(png|jpg|jpeg)$/.test(img.name)) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        resolve(reader.result);
      })
      reader.readAsDataURL(img);
    } else {
      resolve('');
    }
  })
}

export const deletedPageNumber = function deletedPageNumber(dataSourceCount: number, currentPageNumber: number, pageSize: number = PAGE_SIZE, deletedCount: number = 1) {
  const fullPages = Math.floor(deletedCount / pageSize);
  return Math.min(currentPageNumber, Math.max(1, currentPageNumber - fullPages - Math.floor((deletedCount - fullPages * pageSize) / dataSourceCount)));
}


export interface IIDGenerator {
  key: string,
  index: number,
  getNewId: () => string,
  is: (id: string) => boolean
}

export class IDGenerator {
  key: string = ''
  index: number = 0

  constructor(key) {
    this.key = key
  }

  getNewId() {
    return `new${this.key}_${this.index++}`
  }

  is(id): boolean {
    return new RegExp(`^new${this.key}_\\d+$`).test(String(id))
  }
}