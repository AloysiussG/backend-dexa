import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { PrismaService } from '../common/prisma.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [SeederService, PrismaService],
})
export class SeederModule {}
