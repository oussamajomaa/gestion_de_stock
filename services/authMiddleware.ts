import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret";

export function authMiddleware(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        console.log("Authorization Header:", authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error("No token provided");
            return { error: "Unauthorized: No token provided", status: 401 };
        }

        const token = authHeader.split(' ')[1];
        console.log("Extracted Token:", token);

        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("Decoded Token:", decoded);

        return { user: decoded };
    } catch (error) {
        console.error("Token verification error:", error);
        return { error: "Unauthorized: Invalid token", status: 401 };
    }
}
