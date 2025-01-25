import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, token missing' });
    }
    const tokenWithoutBearer = token.split(' ')[1];
    if (!tokenWithoutBearer) {
        return res.status(401).json({ message: 'Unauthorized, token invalid' });
    }
    jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: `Unauthorized` })
        }
        req.userId = decoded.id;
        next();
    })
}

export default authMiddleware;