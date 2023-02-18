import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
//import express validator

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err){
            return res.status(403).json({
                status: false, 
                message: "tidak ada autentifikasi",
                error : err.message
            });
        }
        req.email = decoded.email;
        next();
    })
}