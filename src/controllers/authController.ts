import "dotenv/config";
import { prisma } from "../lib/prisma.js";
import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
    try {
        const parseResult = registerSchema.safeParse(req.body);

        if (!parseResult.success) {
            return res.status(400).json({
                errors: parseResult.error.issues,
            });
        }
        const { username, email, password } = parseResult.data;

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            },
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                name: username,
                email: email,
                password: hashedPassword,
            }
        });

        const data = {user: 
            { useremail: email, userid: user.id } 
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined");
        }
        const jwtData=jwt.sign(data, secret);
        
        return res.status(201).json({
            message: "User registered successfully",
            jwtData
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const parseResult = loginSchema.safeParse(req.body);

        if (!parseResult.success) {
            return res.status(400).json({
                errors: parseResult.error.issues,
            });
        }

        const { email, password } = parseResult.data;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
        });

        if (!user) {
            return res.status(400).json({
                message: "Email or password is incorrect",
            });
        }

        const passwordCompare = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordCompare) {
            return res.status(400).json({
                message: "Email or password is incorrect",
            });
        }
        const data = {user: 
            { useremail: email, userid: user.id }
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined");
        }
        const jwtData=jwt.sign(data, secret);

        return res.status(200).json({
            message: "User logged in successfully",
            jwtData
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};