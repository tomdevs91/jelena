import prisma from '../../utils/prisma';
import { defineEventHandler, EventHandlerRequest } from '../../utils/events';

export default defineEventHandler(async (event: EventHandlerRequest) => {
    const idStr = event.context.params?.id;
    if (!idStr) {
        event.res.statusCode = 400;
        return { message: 'ID parameter is missing' };
    }

    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
        event.res.statusCode = 400;
        return { message: 'Invalid ID' };
    }

    const customer = await prisma.customer.findUnique({ where: { id } });

    if (!customer) {
        event.res.statusCode = 404;
        return { message: 'Customer not found' };
    }

    return customer;
}); 