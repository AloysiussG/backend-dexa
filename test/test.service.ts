import { Injectable } from '@nestjs/common';
import { toUTC } from 'src/common/date.helper';
import { PrismaService } from 'src/common/prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteEmployee() {
    await this.prismaService.user.deleteMany({
      where: {
        email: 'johndoe@gmail.com',
      },
    });
  }

  async addEmployee() {
    await this.prismaService.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: await bcrypt.hash('johndoe', 10),
        role: 'Employee',
        hiredDate: toUTC('2025-09-25'),
        token: 'test',
      },
    });
  }
}
