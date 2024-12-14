import { body,validationResult } from "express-validator";

export const validerInscription = [
    body('firstname')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Le prénom doit être entre 3 et 20 caractères.'),
    body('lastname')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Le nom doit être entre 3 et 30 caractères.'),
    body('address')
        .trim()
        .notEmpty()
        .withMessage("L'adresse ne doit pas être vide."),
    body('email')
        .trim()
        .isEmail()
        .withMessage("L'adresse Email semble invalide."),
    body('password')
        .isLength({ min: 8 })
        .withMessage("Le mot de passe doit être d'au moins 8 caractères"),
    body('repeat_password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Les mots de passe ne matchent pas');
            }
            return true;
        }),
    (req, res, next) => {
        const errors = validationResult(req);
        console.log(errors)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export const validerLogin = [
    body('email')
        .trim()
        .isEmail()
        .withMessage("L'adresse Email semble invalide."),
    body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage("Le mot de passe doit être d'au moins 8 caractères"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }

];