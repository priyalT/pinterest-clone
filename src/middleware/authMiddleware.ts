import "dotenv/config";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface MyJwtPayload {
    user: {
        useremail: string;
    }
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).send({
                error: "Please authenticate using a valid token",
            });        
        }
        
        const [scheme, token] = authHeader.split(" ");
        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({
                error: "Invalid authorization header",
            });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT secret missing");
        }
        const data = jwt.verify(token, secret) as MyJwtPayload;
        req.user = data.user;
        next();
    } 
    catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
};

