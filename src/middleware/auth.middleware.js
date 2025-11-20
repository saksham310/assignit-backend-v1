import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const authMiddleware =  (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, token missing' });
    }
    const tokenWithoutBearer = token.split(' ')[1];
    if (!tokenWithoutBearer) {
        return res.status(401).json({ message: 'Unauthorized, token invalid' });
    }
    jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: `Unauthorized` })
        }
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(440).json({ message: 'Unauthorized, user not found' });
        }
        req.userId = decoded.id;
        next();
    })
}

export default authMiddleware;