import "dotenv/config";
import { prisma } from "../lib/prisma.js";
import { Request, Response } from "express";
import { is } from "zod/locales";
import { error } from "node:console";
import { createBoardSchema, getBoardSchema, updateBoardSchema } from "../schemas/board.schema.js";
import { get } from "node:http";

export const createBoard = async (req: Request, res: Response) => {
    try {
        const parseBoard = createBoardSchema.safeParse(req.body);
        if (!parseBoard.success) {
            return res.status(400).json({
                errors: parseBoard.error.issues,
            });
        }
        const board = await prisma.board.create({
            data: {
                userId: req.user.userid as string,
                name: parseBoard.data.name as string,
            }

        })
        
        return res.status(201).json({
            message: "Board created successfully."
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

export const getBoard = async (req: Request, res: Response) => {
    try {
        const parseGetBoard = getBoardSchema.safeParse(req.params);
        if (!parseGetBoard.success) {
            return res.status(400).json({
                errors: parseGetBoard.error.issues,
            });
        }
        const { id } = parseGetBoard.data;

        const board = await prisma.board.findUnique({
            where: {
                id: id 
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                savedPins: {
                    orderBy: { savedAt: 'desc' },
                    include: {
                        pin: true
                    }
                }
            }
        });

        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }
        
        return res.status(200).json({
            message: "Board found",
            data: {
                id: board.id,
                name: board.name,
                author: board.user,
                pins: board.savedPins.map(savedPin => savedPin.pin) 
            }
        })

    } catch(error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

export const updateBoard = async (req: Request, res: Response) => {
    try {
        const parseUpdateBoard = getBoardSchema.safeParse(req.params);
        if (!parseUpdateBoard.success) {
            return res.status(400).json({
                errors: parseUpdateBoard.error.issues,
            });
        }
        const { id } = parseUpdateBoard.data;

        const board = await prisma.board.findUnique({
            where: {
                id: id
            },
        });

        if (!board) {
            return res.status(404).json({
                message: "Board not found",
            });
        }
        if (board.userId !== req.user.userid) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        const parseUpdate = updateBoardSchema.safeParse(req.body);
        
        if (!parseUpdate.success) {
            return res.status(400).json({
                errors: parseUpdate.error.issues,
            });
        }
        const { name } = parseUpdate.data;

        const updateData: { name?: string; } = {
            name,
        };

        const boardUpdate = await prisma.board.update({
            where: {
                id: id
            },
            data: updateData
        })
        return res.status(200).json({
            message: "Board updated",
            data: {
                name: boardUpdate.name,
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

export const deleteBoard = async (req: Request, res: Response) => {
    try {
        const parseGetBoard = getBoardSchema.safeParse(req.params);
        if (!parseGetBoard.success) {
            return res.status(400).json({
                errors: parseGetBoard.error.issues,
            });
        }
        const { id } = parseGetBoard.data;

        const board = await prisma.board.findUnique({
            where: {
                id: id
            },
        });

        if (!board) {
            return res.status(404).json({
                message: "Board not found",
            });
        }
        if (board.userId !== req.user.userid) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }
        
        await prisma.board.delete({
            where: {
                id: id
            }
        })
        return res.status(200).json({
            message: "Board deleted",
        })



    } catch(error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        })
    }
}