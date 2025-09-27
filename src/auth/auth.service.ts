import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { LoginRequest, LoginResponse } from 'src/model/auth.model';
import { Logger } from 'winston';
import { AuthValidation } from './auth.validation';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async login(request: LoginRequest): Promise<LoginResponse> {
    this.logger.info(`AuthService.login(${JSON.stringify(request)})`);

    // validation
    const newRequest = this.validationService.validate<LoginRequest>(
      AuthValidation.LOGIN,
      request,
    );

    // check user
    let user = await this.prismaService.user.findUnique({
      where: {
        email: newRequest.email,
      },
    });

    if (!user) throw new HttpException('Email or password is invalid', 401);

    const isPasswordValid = await bcrypt.compare(
      newRequest.password,
      user.password,
    );

    if (!isPasswordValid)
      throw new HttpException('Email or password is invalid', 401);

    // if valid, create token uuid
    const token = uuid();

    user = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: token,
      },
    });

    return {
      id: user.id.toString(),
      name: user.name,
      token: user?.token ? (user.token as string) : '',
    };
  }
}
