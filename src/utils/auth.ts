import jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';

export const JWT_SECRET = '91eeb1f52ba6b1f4d29de0a7f10ab504fd1beb8fc1d9efbbfe8886364f824168';

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
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        return decoded;
    } catch (error) {
        return null;
    }
} 