import express from 'express';
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from '../models/Users.js';
import { verifyToken } from './users.js';

const router = express.Router();

// Get all created recipes
router.get("/", async (req, res) => {
    try {
        const response = await RecipesModel.find({});
        res.json(response);
    } catch (err) {
        res.json(err);
    }
});

// Create a recipe 
router.post("/", verifyToken, async (req, res) => {

    const recipe = new RecipesModel(req.body);

    try {
        const response = await recipe.save();
        res.json(response);
    } catch (err) {
        res.json(err);
    }
});

// Save a recipe
router.put("/", verifyToken, async (req, res) => {

    try {
        const recipe = await RecipesModel.findById(req.body.recipeID);
        const user = await UserModel.findById(req.body.userID);
        user.savedRecipes.push(recipe);
        await user.save();
        res.json({ savedRecipes: user.savedRecipes });
    } catch (err) {
        res.json(console.err);
    }
});


router.get("/savedRecipes/ids/:userID", async (req, res) => {

    try {
        const user = await UserModel.findById(req.params.userID);
        res.json({ savedRecipes: user?.savedRecipes });
    } catch (err) {
        res.json(err);
    }

});

router.get("/savedRecipes/:userID", async (req, res) => {

    try {
        const user = await UserModel.findById(req.params.userID);
        const savedRecipes = await RecipesModel.find({
            _id: { $in: user.savedRecipes }
        });
        res.json({ savedRecipes });
    } catch (err) {
        res.json(err);
    }

});


export { router as recipesRouter };