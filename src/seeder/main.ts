import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  // Create a Nest application context (no HTTP server)
  const appContext = await NestFactory.createApplicationContext(SeederModule);

  try {
    const seeder = appContext.get(SeederService);

    // Call your seeder method
    await seeder.seedUsers(); // or seedAttendances(), etc.

    console.log('Seeding finished successfully!');
  } catch (error) {
    console.error('Seeding failed', error);
  } finally {
    await appContext.close();
  }
}

bootstrap();
