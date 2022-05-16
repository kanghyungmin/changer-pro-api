import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
/**
 * query string의 경우 ValidationPipe 적용시 @Type()을 통해 타입을 명시해줘야 한다.
 */
export class QueryPaginate {
  @IsNumber()
  @Type(() => Number)
  start = 0;

  @IsNumber()
  @Type(() => Number)
  length = 10;
}
