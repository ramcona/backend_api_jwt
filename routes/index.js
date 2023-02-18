import express from "express";
import { getUsers, Register, Login, Logout } from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { validateRegister, validateLogin } from '../middleware/userValidator.js';
 
const router = express.Router();
 
router.get('/users', verifyToken, getUsers);
router.route('/users/register').post(validateRegister, Register);
router.post('/users/login', validateLogin, Login);
router.get('/token', refreshToken);
router.delete('/users/logout', Logout);
 
export default router;