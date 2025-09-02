import { generateToken, setCookies, storeRefreshToken } from "../helpers/authHelper.js";
import { redis } from "../lib/redis.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken"


export const signUp = async (req, res) => {
  try {
    
    const { username , password , email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json( { message : "user already exists" })
    }

    if ( !username && !password && !email ) {
      return res.status(400).json({ message : "please provide username , password and email" })
    }



    const user = await User.create({
      username,
      password,
      email
    })

    // authenticate the user

    const { accessToken , refreshToken } = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken)
    setCookies(res, refreshToken, accessToken);


    res.status(200).json({user : {
      username : user.username,
      email : user.email,
      role : user.role,
    }});
  } catch (error) {
    console.error(" error in signing up user" , error);
    res.status(500).json({ message : error.message })
  }
}


export const signIn = async (req, res) =>  {
  try {

    const { email , password } = req.body;


    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json( { message : "both email and password is incorrect" })
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(400).json({ message : "both email and password is incorrect" })
    }


    const { accessToken , refreshToken } = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken)
    setCookies(res, refreshToken, accessToken);

    res.status(200).json({user : {
      username : user.username,
      email : user.email,
      role : user.role,
      createdAt : user.createdAt,
      updatedAt : user.updatedAt
    }})

    
  } catch (error) {
    console.error(" error in signing in user" , error);
    res.status(500).json({ message : error.message })
  }
}



export const refreshToken = async (req, res ) => {
  try {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(404).json( { message : "no refresh token is provided" })
    }

    const decoded = jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET_KEY);
    const storedRefreshToken = await redis.get(`refreshToken:${decoded.userId}`)

    if (storedRefreshToken !== refreshToken) {
      res.status(401).json({ message : "invalid refreshToken"})
    }
    

    const accessToken =  jwt.sign({userId : decoded.userId} , process.env.TOKEN_SECRET_KEY, { expiresIn : "1y" } )

    res.cookie("accessToken" , accessToken , {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 365,
    } )

    res.status(200).json( { message : "token refreshed successfully" , accessToken})
  } catch (error) {
    console.error(" error in refreshToken" , error);
    res.status(500).json({ message : error.message })
  }
}


export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user data found" });
    }

    // ✅ Wrap the user object in a `user` field
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const LogOut = async (req, res)  => {
  try {
    const user = req.body;
    const accessToken = req.cookies.accessToken
    const refreshToken = req.cookies.refreshToken
    

    if (accessToken) {
      const decoded = jwt.verify(accessToken, process.env.TOKEN_SECRET_KEY)
      await redis.del(`accessToken:${decoded.userId}`)
    }

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)
      await redis.del(`refreshtoken:${decoded.userId}`)
    }

    res.clearCookie("accessToken");
		res.clearCookie("refreshToken")
    res.status(200).json({ message : "LoggedOut successfully" , user})
  } catch (error) {
    console.error(" error in logout user" , error);
    res.status(500).json({ message : error.message })
  }
}

