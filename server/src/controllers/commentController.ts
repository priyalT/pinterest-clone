import "dotenv/config";
import { prisma } from "../lib/prisma.js";
import { Request, Response } from "express";
import { commentsSchema, deleteCommentSchema } from "../schemas/comment.schema.js";
import { getPinFeedSchema, getPinSchema } from "../schemas/pin.schema.js";

export const createComment = async (req: Request, res: Response) => {
    try {
        const parseComment = commentsSchema.safeParse(req.body);
        if (!parseComment.success) {
            return res.status(400).json({
                errors: parseComment.error.issues,
            });
        }

        const parseGetPin = getPinSchema.safeParse(req.params);
        if (!parseGetPin.success) {
            return res.status(400).json({
                errors: parseGetPin.error.issues,
            });
        }
        const { id } = parseGetPin.data;

        const comment = await prisma.comment.create({
            data: {
                text: parseComment.data.text,
                userId: req.user.userid,
                pinId: id

            }
        })
        
        return res.status(201).json({
            message: "Commented successfully."
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

export const getComment = async (req: Request, res: Response) => {
    try {
        const parseGetComment = getPinSchema.safeParse(req.params);
        if (!parseGetComment.success) {
            return res.status(400).json({
                errors: parseGetComment.error.issues,
            });
        }
        const parseGetCommentFeed = getPinFeedSchema.safeParse(req.query);
        if (!parseGetCommentFeed.success) {
            return res.status(400).json({
                errors: parseGetCommentFeed.error.issues,
            });
        }
        const { id } = parseGetComment.data;
        const { page, limit } = parseGetCommentFeed.data; 
        const [comments, totalCount] = await Promise.all([
            prisma.comment.findMany({
                where: {
                    pinId: id
                },
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            avatar: true,
                            id: true
                        }
                    },
                },
                take: limit
        }),
        prisma.comment.count({
            where: {
                pinId: id
            }
        })
    ]);
        const totalPages = Math.ceil(totalCount / limit)

        if (comments.length === 0) {
            return res.status(200).json({
                message: "No comments yet",
                data: []
            });
        }
        
        const formattedComments = comments.map(comment => ({
            id: comment.id,
            text: comment.text,
            createdAt: comment.createdAt,
            author: {
                id: comment.user.id,
                name: comment.user.name,
                avatar: comment.user.avatar
            }
        }));

        return res.status(200).json({
            message: "Comments found",
            data: formattedComments, totalCount, totalPages, currentPage: page
        })

    } catch(error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        })
    }
}


export const deleteComment = async (req: Request, res: Response) => {
    try {
        const parseGetComment = deleteCommentSchema.safeParse(req.params);
        if (!parseGetComment.success) {
            return res.status(400).json({
                errors: parseGetComment.error.issues,
            });
        }
        const { id } = parseGetComment.data;

        const comment = await prisma.comment.findUnique({
            where: {
                id: id
            },
        });

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }
        if (comment.userId !== req.user.userid) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }
        
        await prisma.comment.delete({
            where: {
                id: id
            }
        })
        return res.status(200).json({
            message: "Comment deleted",
        })

    } catch(error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        })
    }
}