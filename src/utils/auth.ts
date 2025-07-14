import jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';

// Load JWT secret from environment variable
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required');
}

export const JWT_SECRET: string = jwtSecret;

export interface DecodedToken {
    userId: number;
    email: string;
}

export function verifyToken(req: IncomingMessage): DecodedToken | null {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    
    const token = authHeader.substring(7);
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        
        // Type guard to ensure the payload has the required properties
        if (
            typeof decoded === 'object' &&
            decoded !== null &&
            typeof decoded.userId === 'number' &&
            typeof decoded.email === 'string'
        ) {
            return {
                userId: decoded.userId,
                email: decoded.email
            };
        }
        
        return null;
    } catch (error) {
        return null;
    }
}

// Helper function to generate a token (for testing/development)
export function generateToken(payload: { userId: number; email: string }, expiresIn: string = '24h'): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}