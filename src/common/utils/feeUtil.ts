import BigNumber from 'bignumber.js';
import { CustomError } from '../classes/error';
import { ErrorType } from '../enums/errorType';
import { FeeType } from '../enums/feeType';

export class Fee {
  amount: BigNumber;
  type: FeeType;
}

export class FeeUtil {
  public static calculate(amount: BigNumber, fee: Fee) {
    let feeAmount: BigNumber;

    console.log('amount', amount);
    console.log('fee', fee);
    console.log('fee.type', fee.type);
    console.log('FeeType.NoFee', FeeType.NoFee);
    console.log('==', fee.type == FeeType.NoFee);
    console.log('===', fee.type === FeeType.NoFee);
    switch (fee.type) {
      case FeeType.NoFee:
        console.log('NoFee');
        feeAmount = new BigNumber(0);
        break;
      case FeeType.Amount:
        console.log('Amount');
        feeAmount = fee.amount;
        break;
      case FeeType.Rate:
        console.log('Rate');
        feeAmount = amount.multipliedBy(fee.amount);
        break;
      default:
        throw new CustomError(
          `${
            ErrorType.E402_INVALID_PARAMETER
          }, Fee type must be one of ${Object.values(FeeType).join(', ')}`,
          402,
        );
    }
    // console.log('feeAmount', feeAmount);
    // console.log('is string feeAmount', new BigNumber(feeAmount).toString());
    return feeAmount;
  }
}
