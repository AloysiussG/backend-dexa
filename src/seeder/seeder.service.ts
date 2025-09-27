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

interface SeedAttendance {
  userId: number;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  status?: 'Present' | 'Late' | 'Absent';
  photoUrl?: string;
}

@Injectable()
export class SeederService {
  constructor(private readonly prisma: PrismaService) {}

  async unseedAttendances() {
    await this.prisma.attendance.deleteMany({});
    console.log('All attendances deleted');
  }

  async unseedUsers() {
    // Delete all users (cascades to attendances if have `onDelete: CASCADE`)
    await this.prisma.user.deleteMany({});
    console.log('All users deleted');
  }

  async seedUsers() {
    // Load JSON data
    const filePath = path.join(__dirname, 'data', 'users.json'); // JSON file path
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
            id: user.id,
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

  async seedAttendances() {
    // Load JSON data
    const filePath = path.join(__dirname, 'data', 'attendances.json'); // JSON file path
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const attendances = JSON.parse(rawData) as SeedAttendance[];

    for (const attendance of attendances) {
      await this.prisma.attendance.create({
        data: {
          userId: attendance.userId,
          date: toUTC(attendance.date),
          checkInTime: toUTC(attendance.checkInTime),
          checkOutTime: attendance.checkOutTime
            ? toUTC(attendance.checkOutTime)
            : null,
          status: attendance.status,
          photoUrl: attendance.photoUrl || '',
        },
      });
    }

    console.log('Attendances seeded successfully');
  }
}
