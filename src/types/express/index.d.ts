import "express";

declare global {
    namespace Express {
        interface Request {
            user: {
                useremail: string;
                userid: string;
            };
        }
    }
}

export {};