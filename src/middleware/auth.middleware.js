import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required' });
    }
    
    const tokenWithoutBearer = token.split(' ')[1];
    if (!tokenWithoutBearer) {
        return res.status(401).json({ message: 'Invalid token format' });
    }
    
    jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            // Distinguish between expired and invalid tokens
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Session expired. Please login again.' });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid authentication token' });
            }
            return res.status(401).json({ message: 'Authentication failed' });
        }
        
        try {
            const user = await prisma.user.findUnique({ where: { id: decoded.id } });
            if (!user) {
                return res.status(401).json({ message: 'User account not found or has been deleted' });
            }
            req.userId = decoded.id;
            req.user = user; // Attach user to request for convenience
            next();
        } catch (dbError) {
            console.error('Auth middleware database error:', dbError);
            return res.status(500).json({ message: 'Internal server error during authentication' });
        }
    });
}

export default authMiddleware;