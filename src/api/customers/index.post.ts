import prisma from '../../utils/prisma';
import { defineEventHandler, EventHandlerRequest } from '../../utils/events';

export default defineEventHandler(async (event: EventHandlerRequest) => {
  const { name, email } = event.body;
  const customer = await prisma.customer.create({
      data: { name, email },
  });
  event.res.statusCode = 201;
  return customer;
}); 