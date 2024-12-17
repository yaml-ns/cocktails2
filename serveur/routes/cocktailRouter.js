import { Router } from "express";
import {
    getCocktails,
    getCocktail,
    deleteCocktail,
    createCocktail,
    updateCocktail
} from "../controllers/cocktailController.js";
import {validerCocktail} from "../middlewares/cocktailValidation.js";

const router = Router();

router.get("/",getCocktails);
router.post("/",validerCocktail, createCocktail);
router.get("/:id",getCocktail);
router.put("/:id",validerCocktail, updateCocktail);
router.delete("/:id",deleteCocktail)
export default router;