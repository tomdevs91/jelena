import prisma from '../../utils/prisma';
import { defineSecureEventHandler, EventHandlerRequest } from '../../utils/events';

export default defineSecureEventHandler(async (event: EventHandlerRequest) => {
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

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
        event.res.statusCode = 404;
        return { message: 'Product not found' };
    }

    return product;
}); 