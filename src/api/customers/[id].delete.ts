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

    try {
        await prisma.customer.delete({ where: { id } });
        // No return value will result in a 204 No Content
    } catch (error) {
        event.res.statusCode = 404;
        return { message: 'Customer not found' };
    }
}); 