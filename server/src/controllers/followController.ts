import "dotenv/config";
import { prisma } from "../lib/prisma.js";
import { Request, Response } from "express";
import { getUserSchema } from "../schemas/user.schema.js";
import { getPinFeedSchema } from "../schemas/pin.schema.js";

export const followUser = async (req: Request, res: Response) => {
    try {
        const parseUserId = getUserSchema.safeParse(req.params)
        if (!parseUserId.success) {
            return res.status(400).json({
                errors: parseUserId.error.issues,
            });
        }
        const { id } = parseUserId.data

        if (req.user.userid === id) {
            return res.status(400).json({
                message: "Users cannot follow themselves"
            })
        }

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

        const [newFollower, followedUser, actingUser] = await prisma.$transaction([
            prisma.follow.create({
                data: {
                    followerId: req.user.userid,
                    followingId: id
                }
            }),

            prisma.user.update({
                where: { id: id },
                data: {
                    followerCount: { increment: 1 }
                }
            }),
            
            prisma.user.update({
                where: { id: req.user.userid },
                data: {
                    followingCount: { increment: 1 }
                }
            })
        ])

        return res.status(201).json({
            message: "Followed successfully",
            totalFollower: followedUser.followerCount
        })

    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: "You already follow this person" })
        }
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const unfollowUser = async (req: Request, res: Response) => {
    try {
        const parseUserId = getUserSchema.safeParse(req.params)
        if (!parseUserId.success) {
            return res.status(400).json({
                errors: parseUserId.error.issues,
            });
        }
        const { id } = parseUserId.data

        if (req.user.userid === id) {
            return res.status(400).json({
                message: "Users cannot unfollow themselves"
            })
        }

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

        const [oldFollower, unfollowedUser, actingUser] = await prisma.$transaction([
            prisma.follow.delete({
                where: {followerId_followingId:
                    {
                        followerId: req.user.userid,
                        followingId: id
                    }
                }
            }),

            prisma.user.update({
                where: { id: id },
                data: {
                    followerCount: { decrement: 1 }
                }
            }),
            
            prisma.user.update({
                where: { id: req.user.userid },
                data: {
                    followingCount: { decrement: 1 }
                }
            })
        ])

        return res.status(200).json({
            message: "UnFollowed successfully",
            totalFollower: unfollowedUser.followerCount
        })

    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(400).json({ message: "You already unfollowed this person" })
        }
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getFollowerFeed = async (req: Request, res: Response) => {
    try {
        const parseGetFollowerFeed = getPinFeedSchema.safeParse(req.query);
        if (!parseGetFollowerFeed.success) {
            return res.status(400).json({
                errors: parseGetFollowerFeed.error.issues,
            });
        }

        const { page, limit } = parseGetFollowerFeed.data; 

        const [followerFeed, totalCount] = await Promise.all([
            prisma.follow.findMany({
                where: {
                    followingId: req.user.userid
                },
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    follower: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true
                        }
                    },
                },
                take: limit
        }),
        prisma.follow.count({
            where: {
                followingId: req.user.userid
            }
        })
    ]);
        const totalPages = Math.ceil(totalCount / limit)

        if (followerFeed.length === 0) {
            return res.status(200).json({
                message: "No users followed created yet"
            })
        }

        return res.status(200).json({
            data: followerFeed, totalCount, totalPages, currentPage: page
        })
    } catch(error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        })
    }
};

export const getFollowingFeed = async (req: Request, res: Response) => {
    try {
        const parseGetFollowerFeed = getPinFeedSchema.safeParse(req.query);
        if (!parseGetFollowerFeed.success) {
            return res.status(400).json({
                errors: parseGetFollowerFeed.error.issues,
            });
        }

        const { page, limit } = parseGetFollowerFeed.data; 

        const [followingFeed, totalCount] = await Promise.all([
            prisma.follow.findMany({
                where: {
                    followerId: req.user.userid
                },
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    following: {
                        select: {
                            id: true, 
                            name: true,
                            avatar: true
                        }
                    },
                },
                take: limit
        }),
        prisma.follow.count({
            where: {
                followerId: req.user.userid
            }
        })
    ]);
        const totalPages = Math.ceil(totalCount / limit)

        if (followingFeed.length === 0) {
            return res.status(200).json({
                message: "No users followed created yet"
            })
        }

        return res.status(200).json({
            data: followingFeed, totalCount, totalPages, currentPage: page
        })
    } catch(error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        })
    }
};