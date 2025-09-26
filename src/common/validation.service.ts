import { Injectable } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ValidationService {
  validate<TGeneric>(zodType: ZodType, data: TGeneric): TGeneric {
    const result = zodType.parse(data);
    return result as TGeneric;
  }
}
