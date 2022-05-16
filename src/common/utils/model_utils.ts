import BigNumber from 'bignumber.js';

export const bigNumber2String = (value: BigNumber) => value.toString();

export const string2BigNumber = (value: string) => new BigNumber(value);

export const bigNumberSerializer = {
  get: string2BigNumber,
  set: bigNumber2String,
};
