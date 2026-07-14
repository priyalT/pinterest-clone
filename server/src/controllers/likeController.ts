import "dotenv/config";
import { prisma } from "../lib/prisma.js";
import { Request, Response } from "express";
import { likeSchema } from "../schemas/like.schema.js";

export const createLike = async (req: Request, res: Response) => {
    try {
        const parsePinId = likeSchema.safeParse(req.params);
        if (!parsePinId.success) {
            return res.status(400).json({
                errors: parsePinId.error.issues
            });
        }
        const userId = req.user.userid
        const { id } = parsePinId.data

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

        const [newLike, updatedPin] = await prisma.$transaction([
            prisma.like.create({
                data: {
                    userId: userId,
                    pinId: id
                }
            }),

            prisma.pin.update({
                where: { id: id },
                data: {
                    likeCount: { increment: 1 }
                }
            })
        ])

        return res.status(201).json({
            message: "Pin liked successfully",
            totalLikes: updatedPin.likeCount
        })
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: "You already liked this pin" })
        }
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const deleteLike = async (req: Request, res: Response) => {
    try {
        const parsePinId = likeSchema.safeParse(req.params);
        if (!parsePinId.success) {
            return res.status(400).json({
                errors: parsePinId.error.issues
            });
        }
        const userId = req.user.userid
        const { id } = parsePinId.data
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

        const like = await prisma.like.findUnique({
            where: {
                userId_pinId: {
                    userId: userId,
                    pinId: id
                }
            }
        });

        if (!like) {
            return res.status(404).json({
                message: "The pin is not liked by the user"
            })
        }

        if (like.userId !== req.user.userid) {
            return res.status(403).json({
                message: "Forbidden"
            })
        }

        const [deletedLike, updatedPin] = await prisma.$transaction([
            prisma.like.delete({
                where: {
                    userId_pinId: {
                        userId: userId,
                        pinId: id
                    }
                }
            }
            ),
            prisma.pin.update({
                where: {
                    id: id
                },
                data: {
                    likeCount: { decrement: 1 }
                }
            }

            )
        ])
        return res.status(200).json({
            message: "Pin unliked successfully",
            totalLikes: updatedPin.likeCount
        })

    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(400).json({ message: "You already unliked this pin" })
        }
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}
