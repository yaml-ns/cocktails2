import { Router } from "express";
import {getCocktails, getCocktail, deleteCocktail, createCocktail} from "../controllers/cocktailController.js";

const router = Router();

router.get("/",getCocktails);
router.post("/",createCocktail);
router.get("/:id",getCocktail);
router.delete("/:id",deleteCocktail)
export default router;