import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  // Create a Nest application context (no HTTP server)
  const appContext = await NestFactory.createApplicationContext(SeederModule);

  try {
    const seeder = appContext.get(SeederService);

    await seeder.unseedAttendances();
    await seeder.unseedUsers(); // delete all rows first

    // Call your seeder method
    await seeder.seedUsers(); // or seedAttendances(), etc.
    await seeder.seedAttendances();

    console.log('Seeding finished successfully!');
  } catch (error) {
    console.error('Seeding failed', error);
  } finally {
    await appContext.close();
  }
}

bootstrap();
