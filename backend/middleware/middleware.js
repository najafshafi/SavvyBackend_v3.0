import jwt from "jsonwebtoken";


const JWT_SECRET = 'mySuperSecretKey12345!@#$%'

const checkAuth = (req, res, next) => {
    try {
        // Check if the token is in the Authorization header or cookies
        const token = req.cookies.token || req.headers['authorization']?.split(' ')[1]; // Bearer token

        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        // Verify the token
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token is not valid' });
            }

            // If the token is valid, attach the decoded user info to the request object
            req.auth = {
                userId: decoded.userId, // Extract the userId from the decoded token
            };
            next(); // Proceed to the next middleware or route handler
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export default checkAuth;