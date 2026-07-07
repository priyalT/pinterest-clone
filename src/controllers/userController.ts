import "dotenv/config";
import { getUserSchema, updateUserSchema } from "../schemas/user.schema.js";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

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

        const parseUpdate = updateUserSchema.safeParse(req.body);
        
        if (!parseUpdate.success) {
            return res.status(400).json({
                errors: parseUpdate.error.issues,
            });
        }
        const { username, email, password, avatar } = parseUpdate.data;
        const hashedPassword = password ? await bcrypt.hash(password, await bcrypt.genSalt(10)) : undefined;

        const userUpdate = await prisma.user.update({
            where: {
                id: id
            },

            data: {
                name: username,
                password: hashedPassword,
                email: email,
                avatar: avatar
            }
        })
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