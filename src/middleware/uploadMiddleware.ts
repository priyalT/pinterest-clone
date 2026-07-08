import { Request, Response, NextFunction } from "express";
import { uploadPin, uploadAvatar } from "../config/multer.js";
import multer from "multer";

export const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
    uploadPin(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        }
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};

export const uploadAvatarMiddleware = (req: Request, res: Response, next: NextFunction) => {
    uploadAvatar(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        }
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};
