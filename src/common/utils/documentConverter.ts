import { mapValues, isPlainObject } from 'lodash';
import { Model } from 'mongoose';
import BigNumber from 'bignumber.js';

export const definitions = (model: Model<any>) => {
  const schema: any = model.schema;

  return Object.keys(schema.paths).filter(
    (path) => path !== '__v' && path !== '_id',
  );
};

export const mapValuesDeep = (obj: any, fn: any): any =>
  mapValues(obj, (val, key) =>
    isPlainObject(val) ? mapValuesDeep(val, fn) : fn(val, key, obj),
  );
export const normalize = (data: any, includeCredential = false) => {
  mapValuesDeep(data, (value: any, key: any, parent: any) => {
    if (Array.isArray(value)) {
      value.forEach((item) => normalize(item));
      return;
    }

    if (value instanceof Date) {
      parent[key] = value.getTime();
      return;
    }

    if (typeof value === 'object') {
      delete parent._id;
      delete parent.__v;

      if (parent._id) {
        parent.id = parent._id;
      }

      if (!includeCredential) {
        delete parent.apiKey;
        delete parent.account;
      }
    }
  });
};

export const bigNumber2String = (value: BigNumber) => value.toString();

export const string2BigNumber = (value: string) => {
  return new BigNumber(value);
};

export const bigNumberSerializer = {
  get: string2BigNumber,
  set: bigNumber2String,
};
