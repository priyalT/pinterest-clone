import "dotenv/config";
import { prisma } from "../lib/prisma.js";
import { createPinSchema, getPinFeedSchema, getPinSchema, getUserPinFeedSchema, updatePinSchema } from "../schemas/pin.schema.js";
import { Request, Response } from "express";
import { uploadToCloudinary, deleteFromCloudinary } from "../services/cloudinaryService.js";
import { is } from "zod/locales";
import { error } from "node:console";
import { getUserSchema } from "../schemas/user.schema.js";

export const createPin = async (req: Request, res: Response) => {
    try {
        const parsePin = createPinSchema.safeParse(req.body);
        if (!parsePin.success) {
            return res.status(400).json({
                errors: parsePin.error.issues,
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Image file is required.",
            });
        }
        const cloudinaryUpload = await uploadToCloudinary(req.file)

        const pin = await prisma.pin.create({
            data: {
                title: parsePin.data.title,
                description: parsePin.data.description,
                imageUrl: cloudinaryUpload.imageUrl,
                publicId: cloudinaryUpload.publicId,
                userID: req.user.userid
            }
        })
        
        return res.status(201).json({
            message: "Pin created successfully."
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

export const getPin = async (req: Request, res: Response) => {
    try {
        const parseGetPin = getPinSchema.safeParse(req.params);
        if (!parseGetPin.success) {
            return res.status(400).json({
                errors: parseGetPin.error.issues,
            });
        }
        const { id } = parseGetPin.data;

        const pin = await prisma.pin.findUnique({
            where: {
                id: id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!pin) {
            return res.status(404).json({
                message: "Pin not found",
            });
        }
        return res.status(200).json({
            message: "Pin found",
            data: {
                title: pin.title,
                description: pin.description,
                imageUrl: pin.imageUrl,
                author: {
                    id: pin.user.id,
                    name: pin.user.name,
                    email: pin.user.email
                }
            }
        })

    } catch(error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

export const updatePin = async (req: Request, res: Response) => {
    try {
        const parseGetPin = getPinSchema.safeParse(req.params);
        if (!parseGetPin.success) {
            return res.status(400).json({
                errors: parseGetPin.error.issues,
            });
        }
        const { id } = parseGetPin.data;

        const pin = await prisma.pin.findUnique({
            where: {
                id: id
            },
        });

        if (!pin) {
            return res.status(404).json({
                message: "Pin not found",
            });
        }
        if (pin.userID !== req.user.userid) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        const parseUpdate = updatePinSchema.safeParse(req.body);
        
        if (!parseUpdate.success) {
            return res.status(400).json({
                errors: parseUpdate.error.issues,
            });
        }
        const { title, description } = parseUpdate.data;

        const updateData: { title?: string; description?: string; imageUrl?: string; publicId?: string } = {
            title,
            description,
        };

        if (req.file) {
            await deleteFromCloudinary(pin.publicId);
            const updateCloudinaryUpload = await uploadToCloudinary(req.file);
            updateData.imageUrl = updateCloudinaryUpload.imageUrl;
            updateData.publicId = updateCloudinaryUpload.publicId;
        }

        const pinUpdate = await prisma.pin.update({
            where: {
                id: id
            },
            data: updateData
        })
        return res.status(200).json({
            message: "Pin updated",
            data: {
                title: pinUpdate.title,
                description: pinUpdate.description,
                imageUrl: pinUpdate.imageUrl
            }
            }
        )
    } catch(error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

export const deletePin = async (req: Request, res: Response) => {
    try {
        const parseGetPin = getPinSchema.safeParse(req.params);
        if (!parseGetPin.success) {
            return res.status(400).json({
                errors: parseGetPin.error.issues,
            });
        }
        const { id } = parseGetPin.data;

        const pin = await prisma.pin.findUnique({
            where: {
                id: id
            },
        });

        if (!pin) {
            return res.status(404).json({
                message: "Pin not found",
            });
        }
        if (pin.userID !== req.user.userid) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }
        
        await deleteFromCloudinary(pin.publicId);

        await prisma.pin.delete({
            where: {
                id: id
            }
        })
        return res.status(200).json({
            message: "Pin deleted",
        })



    } catch(error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

export const getPinFeed = async (req: Request, res: Response) => {
    try {
        const parseGetPinFeed = getPinFeedSchema.safeParse(req.query);
        if (!parseGetPinFeed.success) {
            return res.status(400).json({
                errors: parseGetPinFeed.error.issues,
            });
        }
        const { page, limit } = parseGetPinFeed.data; 

        const [pinFeed, totalCount] = await Promise.all([
            prisma.pin.findMany({
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            avatar: true
                        }
                    }
                },
                take: limit
        }),
        prisma.pin.count()
    ]);

        const totalPages = Math.ceil(totalCount / limit)

        if (pinFeed.length === 0) {
            return res.status(200).json({
                message: "Feed is empty"
            })
        }

        return res.status(200).json({
            data: pinFeed, totalCount, totalPages, currentPage: page
        })
    } catch(error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

