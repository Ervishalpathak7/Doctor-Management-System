import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
    try {

        const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Access denied. No token provided."
            });
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
        
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please login again."
            });
        }
        
        return res.status(403).json({
            success: false,
            message: "Invalid token."
        });
    }
}