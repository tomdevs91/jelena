import prisma from '../../utils/prisma';
import { defineEventHandler, EventHandlerRequest } from '../../utils/events';

export default defineEventHandler(async (event: EventHandlerRequest) => {
  const { name, description, price } = event.body;
  const product = await prisma.product.create({
      data: { name, description, price },
  });
  event.res.statusCode = 201;
  return product;
}); 