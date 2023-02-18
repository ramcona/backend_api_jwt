import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";

export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['id','name','email']
        });
        return res.status(200).json({
                status: false, 
                message: "User Data",
                user: users[0]
            });
    } catch (error) {
         res.status(500).json({
                status: true, 
                message: error.message,
            });  
    }
}
 
export const Register = async(req, res) => {
    const { name, email, password, confPassword } = req.body;
    if(password !== confPassword) return res.status(400).json({
                status: true, 
                message: "Password and Confirm Password do not match",
            });
    const salt = await bcrypt.genSalt();

    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword
        });
        res.status(200).json({
                status: false, 
                message: "Successfuly to register",
            });       
    } catch (error) {
        res.status(500).json({
                status: true, 
                message: error.message,
            });  
    }
}
 
export const Login = async(req, res) => {
    try {
        const users = await Users.findAll({
            where:{
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, users[0].password);
        if(!match) return res.status(400).json({
                status: true, 
                message: "Password salah",
            });

        //get user data
        const user = users[0];

        //remove password from response
        delete user["password"];

        const userId = user.id;
        const name = user.name;
        const email = user.email;
        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
                status: false, 
                message: "Success Login",
                accessToken: accessToken,
                refreshToken, refreshToken,
                user: user
            });
    } catch (error) {
        res.status(404).json({
                status: true, 
                message: "Email not found"
            });
    }
}
 
export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({refresh_token: null},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.status(200).json({
                status: false, 
                message: "Success Logout"
            });
}