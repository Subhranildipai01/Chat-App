import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId , res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn: '60d'
    });
    res.cookie("jwt", token, {
        maxAge: 60*24*60*60*1000, // Cookie expires in 60 days
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development" // Set secure flag based on environment
    });
};

export default generateTokenAndSetCookie;
