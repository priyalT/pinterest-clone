import fs from "node:fs";
import path from "node:path";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const UPLOAD_DIRS = [
    "uploads/pins"
];

UPLOAD_DIRS.forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const diskStorage = multer.diskStorage({

    destination: (req: Request, file, cb) => {
        const folder = "uploads/pins";
        cb(null, folder);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const userId = req.user.userid;

        cb(null, `${userId}-${Date.now()}${ext}`);
    },
});

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
    storage: diskStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
    },
}).single("pin");