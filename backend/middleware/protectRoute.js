import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectRoute = async(req, res, next) => { 
    try {
        // Extract the token from the request cookies
        const token = req.cookies.jwt;

        // If no token is provided, respond with 401 Unauthorized
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        // Verify the token using the JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If verification succeeds, attach the decoded token to the request object
        if(!decoded){
            return res.status(401).json({error: "Unauthorized - Invalid Token"});
        }

        const user = await User.findById(decoded.userId).select("-password");
        
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        req.user = user
        next(); 
    } catch (error) {
        // If there's an error (e.g., invalid token), respond with 401 Unauthorized
        console.log("Error in protectRoute middleware", error.message);
        return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }
};

export default protectRoute;
