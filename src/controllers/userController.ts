import "dotenv/config";
import { getUserSchema, updateUserSchema } from "../schemas/user.schema.js";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../services/cloudinaryService.js";
import bcrypt from "bcrypt";
import { getUserPinFeedSchema } from "../schemas/pin.schema.js";

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const parseResult = getUserSchema.safeParse(req.params);
        if (!parseResult.success) {
            return res.status(400).json({
                errors: parseResult.error.issues,
            });
        }
        const { id } = parseResult.data;

        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        return res.status(200).json({
            message: "User found",
            data: {
                username: user.name,
                email: user.email,
                avatar: user.avatar,
                createdAt: user.createdAt,
                id: user.id
            }
        })

    } catch(error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const parseResult = getUserSchema.safeParse(req.params);
        if (!parseResult.success) {
            return res.status(400).json({
                errors: parseResult.error.issues,
            });
        }
        const { id } = parseResult.data;

        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.id !== req.user.userid) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        const parseUpdate = updateUserSchema.safeParse(req.body);        
        if (!parseUpdate.success) {
            return res.status(400).json({
                errors: parseUpdate.error.issues,
            });
        }
        const { username, email, password, removeAvatar } = parseUpdate.data;
        const isRemovingAvatar = removeAvatar === true || removeAvatar === 'true';
        const hashedPassword = password ? await bcrypt.hash(password, await bcrypt.genSalt(10)) : undefined;
        let newAvatarUrl = user.avatar
        let newAvatarPublicId = user.avatarPublicId

        if ((isRemovingAvatar || req.file) && user.avatarPublicId) {
            await deleteFromCloudinary(user.avatarPublicId).catch(err =>
                console.error("Failed to delete avatar", err)
            );
        }

        if (isRemovingAvatar) {
            newAvatarUrl = null,
            newAvatarPublicId = null
        };

        if (req.file) {
            const uploadedImage = await uploadToCloudinary(req.file);
            newAvatarPublicId = uploadedImage.publicId;
            newAvatarUrl = uploadedImage.imageUrl;
        }
        
        const userUpdate = await prisma.user.update({
            where: {
                id: id
            },

            data: {
                name: username,
                password: hashedPassword,
                email: email,
                avatar: newAvatarUrl,
                avatarPublicId: newAvatarPublicId
            }
        });
        
        return res.status(200).json({
            message: "User updated",
            data: {
                username: userUpdate.name,
                email: userUpdate.email,
                avatar: userUpdate.avatar,
                new_password: password !== undefined
            }
        })
    } catch(error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

export const deleteUserProfile = async (req: Request, res: Response) => {
    try {
        const parseResult = getUserSchema.safeParse(req.params);
        if (!parseResult.success) {
            return res.status(400).json({
                errors: parseResult.error.issues,
            });
        }
        const { id } = parseResult.data;

        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.id !== req.user.userid) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        const userDelete = await prisma.user.delete({
            where: {
                id: id
            }
        })
        return res.status(200).json({
            message: "User deleted",
        })
    } catch(error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

export const addUserAvatar = async (req: Request, res: Response) => {
    try {
        const parseResult = getUserSchema.safeParse(req.params);
        if (!parseResult.success) {
            return res.status(400).json({
                errors: parseResult.error.issues,
            });
        }
        const { id } = parseResult.data;

        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        return res.status(200).json({
            message: "User found",
            data: {
                username: user.name,
                email: user.email,
                avatar: user.avatar,
                createdAt: user.createdAt,
                id: user.id
            }
        })

    } catch(error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

export const getUserPinFeed = async (req: Request, res: Response) => {
    try {
        const parseGetUserPinFeed = getUserPinFeedSchema.safeParse(req.query);
        if (!parseGetUserPinFeed.success) {
            return res.status(400).json({
                errors: parseGetUserPinFeed.error.issues,
            });
        }

        const parseParams = getUserSchema.safeParse(req.params);
        if (!parseParams.success) {
            return res.status(400).json({ errors: parseParams.error.issues });
        }
        const userId = parseParams.data.id;

        const { page, limit, sort } = parseGetUserPinFeed.data; 

        const sortDirection = sort === "oldest" ? "asc" : "desc";

        const [pinFeed, totalCount] = await Promise.all([
            prisma.pin.findMany({
                where: {
                    userID: userId
                },
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: sortDirection,  
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
        prisma.pin.count({
            where: {
                userID: userId
            }
        })
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
