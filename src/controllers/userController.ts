import "dotenv/config";
import { getUserSchema, updateUserSchema } from "../schemas/user.schema.js";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../services/cloudinaryService.js";
import bcrypt from "bcrypt";
import { getUserPinFeedSchema } from "../schemas/pin.schema.js";
import { getUserBoardFeedSchema } from "../schemas/board.schema.js";

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


export const getUserBoard = async (req: Request, res: Response) => {
    try {
        const parseGetUserBoard = getUserBoardFeedSchema.safeParse(req.query);
        if (!parseGetUserBoard.success) {
            return res.status(400).json({
                errors: parseGetUserBoard.error.issues,
            });
        }

        const parseParams = getUserSchema.safeParse(req.params);
        if (!parseParams.success) {
            return res.status(400).json({ errors: parseParams.error.issues });
        }
        
        const userId = parseParams.data.id;

        const { page, limit, sort } = parseGetUserBoard.data; 

        const sortDirection = sort === "oldest" ? "asc" : "desc";

        const [userBoards, totalCount] = await Promise.all([
            prisma.board.findMany({
                where: {
                    userId: userId
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
                    },
                    savedPins: {
                        take: 3,
                        orderBy: {savedAt: "desc"},
                        include: {
                            pin: {
                                select: { imageUrl: true } 
                            }
                        }
                    }
                    },
                    take: limit
                }),
        prisma.board.count({
            where: {
                userId: userId
            }
        })
    ]);

        const totalPages = Math.ceil(totalCount / limit)

        if (userBoards.length === 0) {
            return res.status(200).json({
                message: "No boards created yet"
            })
        }

        return res.status(200).json({
            data: userBoards, totalCount, totalPages, currentPage: page
        })
    } catch(error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

export const getUserSavedPin = async (req: Request, res: Response) => {
    try {
        const parseSavePin = getUserSchema.safeParse(req.params);
        if (!parseSavePin.success) {
            return res.status(400).json({
                errors: parseSavePin.error.issues,
            });
        }

        const parseGetUserPinFeed = getUserPinFeedSchema.safeParse(req.query);
        if (!parseGetUserPinFeed.success) {
            return res.status(400).json({
                errors: parseGetUserPinFeed.error.issues,
            });
        }

        const { id } = parseSavePin.data;
        const { page, limit, sort } = parseGetUserPinFeed.data;
        
        const sortDirection = sort === "oldest" ? "asc" : "desc";

        const [userSavedPin, totalCount] = await Promise.all([
            prisma.savedPin.findMany({
                where: {
                    userId: id
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { savedAt: sortDirection },
                include: {
                    pin: {
                        select: {
                            title: true,
                            description: true,
                            imageUrl: true
                        }
                    }
                }
            }),
            prisma.savedPin.count({
                where: {
                    userId: id
                }
            })
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        if (userSavedPin.length === 0) {
            return res.status(200).json({
                message: "No saved pins found"
            });
        }

        return res.status(200).json({
            data: userSavedPin,
            totalCount,
            totalPages,
            currentPage: page
        });
        
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
                    },
                    savedPins: req.user ? {
                        where: { userId: req.user.userid as string },
                        select: { savedAt: true }
                    } : false
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

        const formattedFeed = pinFeed.map((pin: any) => {
            const isSaved = pin.savedPins && pin.savedPins.length > 0;
            const { savedPins, ...restOfPin } = pin;
            return {
                ...restOfPin,
                isSaved
            };
        });

        return res.status(200).json({
            data: formattedFeed, totalCount, totalPages, currentPage: page
        })
    } catch(error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        })
    }
}
