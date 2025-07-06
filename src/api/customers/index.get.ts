import prisma from '../../utils/prisma';
import { defineEventHandler } from '../../utils/events';

export default defineEventHandler(async () => {
  const customers = await prisma.customer.findMany();
  return customers;
}); 