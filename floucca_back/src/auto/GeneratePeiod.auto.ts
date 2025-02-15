import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// schedule a task to run at midnight on the first day of every month
cron.schedule('0 0 1 * *', async () => {
  try {
    const newPeriod = await prisma.period.create({
      data: {
        period_date: new Date(),
      },
    });
    console.log('New period created:', newPeriod);

  } catch (error) {
    console.error('Error creating new period:', error);
  }
});