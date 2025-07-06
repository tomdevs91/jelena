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

    const { name, email } = event.body;

    try {
        const customer = await prisma.customer.update({
            where: { id },
            data: { name, email },
        });
        return customer;
    } catch (error) {
        event.res.statusCode = 404;
        return { message: 'Customer not found' };
    }
}); 