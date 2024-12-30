import { Router } from "express";
import {
    getCocktails,
    getCocktail,
    deleteCocktail,
    createCocktail,
    updateCocktail
} from "../controllers/cocktailController.js";
import {validerCocktail} from "../middlewares/cocktailValidation.js";
import {upload} from "../middlewares/singleImageUpload.js";
import { uploadParams } from "../middlewares/uploadParams.js";
import {uploadPath} from "../middlewares/uploadPath.js";

const router = Router();


router.get("/",getCocktails);
router.post("/",
    uploadParams({type: "cocktail"}),
    upload.single("image"),
    uploadPath,
    validerCocktail,
    createCocktail
);
router.put("/:id",

    uploadParams({type: "cocktail"}),
    upload.single("image"),
    uploadPath,
    validerCocktail,
    updateCocktail
);
router.get("/:id",getCocktail);

router.delete("/:id",deleteCocktail)
export default router;