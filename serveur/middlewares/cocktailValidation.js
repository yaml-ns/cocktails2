import { body,validationResult } from "express-validator";

export const validerCocktail = [
    body('nom')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Le nom du cocktail doit être entre 3 et 20 caractères.'),
    body('prix')
        .trim()
        .isNumeric()
        .withMessage('Le prix semble incorrect.'),
    (req, res, next) => {
        const errors = validationResult(req);
        console.log(errors)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
