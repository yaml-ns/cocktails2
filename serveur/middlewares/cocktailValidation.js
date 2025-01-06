import { body, validationResult } from "express-validator";
import fs from "node:fs";

export const validerCocktail = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Le nom du cocktail doit être entre 3 et 20 caractères.'),
    body('price')
        .trim()
        .isNumeric()
        .withMessage('Le prix semble incorrect.'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage("Sélectionnez une catégorie pour le cocktail"),
    body('preparation')
        .trim()
        .notEmpty()
        .withMessage("Ajouter une préparation pour le cocktail"),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (fs.existsSync(req.uploadInfo?.filename)) {
                await fs.promises.unlink(req.uploadInfo.filename);
            }
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];