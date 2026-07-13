import "dotenv/config";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { searchPinSchema } from "../schemas/search.schema.js";
import { getPinFeedSchema } from "../schemas/pin.schema.js";


export const searchPins = async (req: Request, res: Response) => {
    try {
        const parseGetPinFeed = searchPinSchema.safeParse(req.query);
        if (!parseGetPinFeed.success) {
            return res.status(400).json({
                errors: parseGetPinFeed.error.issues,
            });
        }
        const { q, page, limit } = parseGetPinFeed.data; 

        const [pinFeed, totalCount] = await Promise.all([
            prisma.pin.findMany({
                where: {
                    OR: [
                        { title: { contains: q, mode: 'insensitive' } },
                        { description: { contains: q, mode: 'insensitive' } }
                    ]
                },  
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
                    },
                    savedPins: req.user ? {
                        where: { userId: req.user.userid as string },
                        select: { savedAt: true }
                    } : false,
                    likes: req.user ? {
                        where: {userId: req.user.userid as string},
                        select: { createdAt: true}
                    } : false
                },
                take: limit
        }),
        prisma.pin.count({
            where: {
                OR: [
                    { title: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } }
                ]
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
            const isLiked = pin.likes && pin.likes.length > 0;
            
            const { savedPins, likes, ...restOfPin } = pin;
            
            return {
                ...restOfPin,
                isSaved, isLiked
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

export const searchUsers = async (req: Request, res: Response) => {
    try {
        const parseSearch = searchPinSchema.safeParse(req.query);
        if (!parseSearch.success) {
            return res.status(400).json({
                errors: parseSearch.error.issues,
            });
        }
        const { q, page, limit } = parseSearch.data; 

        const [users, totalCount] = await Promise.all([
            prisma.user.findMany({
                where: {
                    name: { contains: q, mode: 'insensitive'}
                },  
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    followers: req.user ? {
                        where: { followerId: req.user.userid }
                    } : false
                },
                take: limit
            }),
            prisma.user.count({
                where: {
                    name: { contains: q, mode: 'insensitive'}
                }
            })
        ]);

        const totalPages = Math.ceil(totalCount / limit)

        if (users.length === 0) {
            return res.status(200).json({
                message: "No users found"
            })
        }

        const formattedUsers = users.map((user: any) => {
            const isFollowing = user.followers && user.followers.length > 0;
            
            // We strip out the password so it doesn't get sent to the frontend!
            const { password, followers, following, ...safeUser } = user; 
            
            return {
                ...safeUser,
                isFollowing
            };
        });

        return res.status(200).json({
            data: formattedUsers, totalCount, totalPages, currentPage: page
        })
    } catch(error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        })
    }
}
