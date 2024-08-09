import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 
import { UserModel } from "../models/Users.js";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const tokenSecret = process.env.TOK_SECRET || "secret";

router.post("/register", async (req, res) => {
    const {username, password} = req.body;

    const user = await UserModel.findOne({username: username});

    if (user) {
        return res.json({message: "User already exists!"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({username: username, password: hashedPassword})
    await newUser.save();

    res.json({message: "User registered successfully! Please log in."});
});

router.post("/login", async (req, res) => {
    const {username, password} = req.body;

    const user = await UserModel.findOne({username: username});

    if (!user) {
        return res.json({message: "User doesn't exist! You may want to register."});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.json({message: "Username or password is incorrect!"});
    }

    // now start process of logging in and authentication

    const token = jwt.sign({id: user._id}, tokenSecret);
    res.json({token, userID: user._id}); // TODO FIX
});

export {router as userRouter};

// Middleware for authentication
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
      jwt.verify(token, tokenSecret, (err) => {
        if (err) return res.sendStatus(403);
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };