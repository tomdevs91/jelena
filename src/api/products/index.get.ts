import prisma from '../../utils/prisma';
import { defineEventHandler, EventHandlerRequest } from '../../utils/events';
import { verifyToken } from '../../utils/auth';
import { HttpError } from '../../utils/error';

export default defineEventHandler(async ({ req }) => {
  const user = verifyToken(req);
  if (!user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const products = await prisma.product.findMany();
  return products;
}); 