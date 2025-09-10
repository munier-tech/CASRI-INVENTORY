import express from "express";
import { getProfile, LogOut, refreshToken, signIn, signUp } from "../Controllers/authController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";
const router = express.Router();


router.post("/signUp" , signUp)
router.post("/signIn" , signIn)
router.post("/refreshToken" , refreshToken)
router.get("/getProfile" , protectedRoute, getProfile)
router.post("/logOut" , LogOut)



export default router;