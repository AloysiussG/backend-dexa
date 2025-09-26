import { Injectable } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ValidationService {
  validate<TGeneric>(zodType: ZodType<TGeneric>, data: TGeneric): TGeneric {
    return zodType.parse(data);
  }
}
