import express from "express"; 
import cors from "cors"; 
import mongoose from "mongoose"; 
import dotenv from 'dotenv';
dotenv.config();

import {userRouter} from "./routes/users.js";
import {recipesRouter} from "./routes/recipes.js";


const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

// DB connection
const uri = process.env.MONGO_CONNECTION_STRING;
mongoose.connect(uri);

app.listen(port, () => console.log(`Server started at http://localhost:${port}`));