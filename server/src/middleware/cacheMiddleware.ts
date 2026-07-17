import { Request, Response, NextFunction } from 'express';
import redisClient from '../lib/redis.js';

export const cacheMiddleware = (ttlInSeconds: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user ? req.user.userid : 'guest';
            const cacheKey = `cache:${req.originalUrl}:user:${userId}`;

            const cachedData = await redisClient.get(cacheKey);

            if (cachedData) {
                return res.status(200).json(JSON.parse(cachedData));
            }

            const originalJson = res.json.bind(res);

            res.json = ((body: any) => {
                redisClient.setEx(cacheKey, ttlInSeconds, JSON.stringify(body));
                return originalJson(body);
            }) as any;

            next();
            
        } catch (error) {
            console.error("Cache middleware error:", error);
            next();
        }
    };
};
