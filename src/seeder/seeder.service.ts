import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { toUTC } from '../common/date.helper';

interface SeedUser {
  id: number;
  name: string;
  email: string;
  role: 'HR' | 'Employee';
  createdAt: string;
  updatedAt: string;
  hiredDate: string;
}

@Injectable()
export class SeederService {
  constructor(private readonly prisma: PrismaService) {}

  async unseedUsers() {
    // Delete all users (cascades to attendances if have `onDelete: CASCADE`)
    await this.prisma.user.deleteMany({});
    console.log('All users deleted');
  }

  async seedUsers() {
    // Load JSON data
    const filePath = path.join(__dirname, 'users.json'); // JSON file path
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const users = JSON.parse(rawData) as SeedUser[];

    for (const user of users) {
      // Check if user already exists
      const existing = await this.prisma.user.findUnique({
        where: { email: user.email },
      });
      if (!existing) {
        // Optional: hash default password
        const password = await bcrypt.hash('defaultPassword123', 10);

        await this.prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            role: user.role,
            hiredDate: user.hiredDate
              ? toUTC(user.hiredDate)
              : toUTC(new Date().toISOString()),
            password,
          },
        });
      }
    }

    console.log('Users seeded successfully');
  }
}
