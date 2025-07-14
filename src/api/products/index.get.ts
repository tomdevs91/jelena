import prisma from '../../utils/prisma';
import { defineSecureEventHandler } from '../../utils/events';

export default defineSecureEventHandler(async () => {
  const products = await prisma.product.findMany();
  return products;
}); 