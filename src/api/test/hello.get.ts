import { defineSecureEventHandler, EventHandlerRequest } from '../../utils/events';

export default defineSecureEventHandler(async (event: EventHandlerRequest) => {
  // Access the authenticated user info from context
  const user = event.context.user;
  return {
    message: `Hello ${user?.email}!`,
    userId: user?.userId,
    timestamp: new Date().toISOString()
  };
}); 