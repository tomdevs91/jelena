import { IncomingMessage, ServerResponse } from 'http';
import { HttpError } from './error';
import { verifyToken, DecodedToken } from './auth';

export interface EventHandlerRequest {
  req: IncomingMessage;
  res: ServerResponse;
  context: {
    params?: Record<string, string>;
    user?: DecodedToken;  // Add user info to context
  };
  body?: any;
}

type Handler = (event: EventHandlerRequest) => any;

export const defineEventHandler = (handler: Handler) => {
  return async (req: IncomingMessage, res: ServerResponse, params?: Record<string, string>) => {
    try {
      const context = { params: params || {} };
      let body;

      if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        let bodyString = '';
        await new Promise(resolve => {
            req.on('data', chunk => {
                bodyString += chunk.toString();
            });
            req.on('end', () => {
                resolve(bodyString);
            });
        });

        if (bodyString) {
          try {
            body = JSON.parse(bodyString);
          } catch (e) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Invalid JSON in request body' }));
            return;
          }
        }
      }

      const result = await handler({ req, res, context, body });

      if (res.writableEnded) {
        return;
      }
      
      if (result === undefined) {
         res.statusCode = 204;
         res.end();
         return;
      }

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = res.statusCode || 200;
      res.end(JSON.stringify(result));

    } catch (error: any) {
        console.error(error);
        if (!res.writableEnded) {
            if (error instanceof HttpError) {
                res.statusCode = error.statusCode;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: error.message }));
            } else {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: error.message || 'Internal server error' }));
            }
        }
    }
  };
};

// 🔒 SECURE EVENT HANDLER WITH AUTHENTICATION MIDDLEWARE
export const defineSecureEventHandler = (handler: Handler) => {
  return async (req: IncomingMessage, res: ServerResponse, params?: Record<string, string>) => {
    try {
      // 🛡️ Authentication middleware - verify JWT token
      const user = verifyToken(req);
      if (!user) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 
          message: 'Authentication required. Please provide a valid Bearer token.' 
        }));
        return;
      }

      const context = { 
        params: params || {},
        user  // Add authenticated user info to context
      };
      let body;

      if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        let bodyString = '';
        await new Promise(resolve => {
            req.on('data', chunk => {
                bodyString += chunk.toString();
            });
            req.on('end', () => {
                resolve(bodyString);
            });
        });

        if (bodyString) {
          try {
            body = JSON.parse(bodyString);
          } catch (e) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Invalid JSON in request body' }));
            return;
          }
        }
      }

      const result = await handler({ req, res, context, body });

      if (res.writableEnded) {
        return;
      }
      
      if (result === undefined) {
         res.statusCode = 204;
         res.end();
         return;
      }

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = res.statusCode || 200;
      res.end(JSON.stringify(result));

    } catch (error: any) {
        console.error(error);
        if (!res.writableEnded) {
            if (error instanceof HttpError) {
                res.statusCode = error.statusCode;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: error.message }));
            } else {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: error.message || 'Internal server error' }));
            }
        }
    }
  };
}; 