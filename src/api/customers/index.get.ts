import prisma from '../../utils/prisma';
import { defineSecureEventHandler } from '../../utils/events';

export default defineSecureEventHandler(async () => {
  const customers = await prisma.customer.findMany();
  return customers;
}); 