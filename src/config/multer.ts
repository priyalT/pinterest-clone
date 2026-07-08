import multer, { FileFilterCallback } from "multer";
import { Request } from "express";


const memoryStorage = multer.memoryStorage();

const imageFileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    const allowed = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
    ];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, PNG, WebP and GIF images are allowed."));
    }
};


export const uploadPin = multer({
    storage: memoryStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
    },
}).single("pin");