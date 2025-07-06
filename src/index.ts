import http from 'http';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const apiDir = path.join(__dirname, 'api');
const corsMiddleware = cors();

const server = http.createServer((req, res) => {
    corsMiddleware(req, res, async () => {
        if (!req.url || !req.method) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid Request' }));
            return;
        }

        const url = req.url.split('?')[0];
        if (!url.startsWith('/api/')) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Not Found' }));
            return;
        }

        const parts = url.substring(5).split('/').filter(Boolean);
        const method = req.method.toLowerCase();
        let params: Record<string, string> = {};

        let handlerPath: string | undefined;

        const findHandler = (currentParts: string[]): string | undefined => {
            // Try .../register/index.post.ts
            let potentialPath = path.join(apiDir, ...currentParts, `index.${method}.ts`);
            if (fs.existsSync(potentialPath)) {
                return potentialPath;
            }

            // Try .../auth/register.post.ts
            const partsCopy = [...currentParts];
            if (partsCopy.length > 0) {
                const lastPart = partsCopy.pop();
                const filePath = path.join(apiDir, ...partsCopy, `${lastPart}.${method}.ts`);
                if (fs.existsSync(filePath)) {
                    return filePath;
                }
            }

            // Try .../products/[id].get.ts
            if (currentParts.length > 0) {
                const paramValue = currentParts.pop();
                const parentDir = path.join(apiDir, ...currentParts);

                if (fs.existsSync(parentDir)) {
                     const dynamicFile = fs.readdirSync(parentDir).find(f => f.startsWith('[') && f.endsWith(`].${method}.ts`));
                     if (dynamicFile) {
                         const paramName = dynamicFile.match(/\[(.*?)\]/)![1];
                         params[paramName] = paramValue!;
                         return path.join(parentDir, dynamicFile);
                     }
                }
            }
            return undefined;
        };

        handlerPath = findHandler([...parts]);

        if (handlerPath) {
            try {
                const handler = require(handlerPath).default;
                await handler(req, res, params);
            } catch (error) {
                console.error(`Error loading or executing handler for ${handlerPath}`, error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `Endpoint not found for ${req.method} ${req.url}` }));
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});