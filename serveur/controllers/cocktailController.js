import { create, deleteById, getAll, getById, getByName, getOneCocktail, update } from "../models/cocktailModel.js";
import fs from "node:fs";
import { fileURLToPath } from "url";
import path from "path";

export const getCocktails = async (req, res) => {
    const filters = req.query;
    try {
        const cocktails = await getAll(filters, req);
        res.statusCode = 200;
        res.json({
            ok: true, result: cocktails.result, pagination: cocktails.pagination

        });
    }catch(e) {
        console.log(e);
        res.statusCode = 500;
        res.json({
            ok: false, error: [{ msg: "une erreur s'est produite" }]
        });
    }

};

export const createCocktail = async (req, res) => {
    try {
        const cocktail = req.body;
        const cocktail_existe = await getByName(cocktail.name);

        if (cocktail_existe) {
            return res.status(400).json({
                ok: false,
                errors: [{ msg: "Un cocktail du même nom existe déjà !" }]
            });
        }

        cocktail.image = req.file ? req.file.filename : null;
        const created = await create(cocktail);

        if (created !== 1) {
            return res.status(500).json({
                ok: false,
                errors: [{ msg: "une erreur s'est produite" }]
            });
        }

        res.status(201).json({
            ok: true,
            message: "Cocktail crée avec succès"
        });

    }catch(e) {
        console.log(e);
        res.status(500).json({
            ok: false,
            errors: [{ msg: "une erreur s'est produite" }]
        });

    }
};
export const getCocktail = async (req, res) => {
    try {
        const cocktail = await getById(parseInt(req.params.id), req);
        if (!cocktail) {
            return res.status(404).json({
                ok: false,
                errors: [{ msg: "Cocktail non trouvé !" }]
            });

        }

        res.status(200).json(cocktail);

    }catch(e) {
        console.log(e);
        res.status(500).json({
            ok: false,
            errors: [{ msg: "Une erreur s'est produite lors de cette opération" }]
        });
    }
};

export const updateCocktail = async (req, res) => {
    try {
        const cocktail = req.body;
        const cocktail_exists = await getOneCocktail(parseInt(req.params.id));

        if (!cocktail_exists) {
            return res.status(404).json({
                ok: false,
                errors: [{ msg: "Cocktail non trouvé !" }]
            });
        }
        
        cocktail.id = cocktail_exists.id;

        if (req.file) {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const image_path = path.join(__dirname, "../../", "client/uploads/images/cocktail/" + cocktail_exists.image);
            cocktail.image = req.file.filename;
            if (cocktail_exists.image) {
                if (fs.existsSync(image_path)) {
                    await fs.promises.unlink(image_path);
                }
            }
        }


        cocktail.image = req.file ? req.file.filename : cocktail_exists.image;
        const result = await update(cocktail);

        if (result === 0) {
            return res.status(500).json({
                ok: false,
                errors: [{ msg: "Échec de la mise à jour du cocktail" }]
            });
        }

        res.status(200).json({
            ok: true,
            message: "Cocktail mis à jour avec succès !"
        });

    }catch(e) {
        console.log(e);
        res.status(500).json({
            ok: false,
            errors: [{ msg: "une erreur s'est produite pendant l'opération !" }]
        });

    }
};

export const deleteCocktail = async (req, res) => {
    try {

        const cocktail = await getById(parseInt(req.params.id), req);
        if (!cocktail) {
            res.status(404).json({
                ok: false,
                errors: [{ msg: "Cocktail non trouvé !" }]
            });
        }

        await deleteById(cocktail.id);
        res.status(200).json({
            ok: true,
            message: `Le cocktail ${req.params.id} a bien été supprimé`
        });

    }catch(e) {
        console.log(e);
        res.status(500).json({
            ok: false, errors: [{ msg: "une erreur s'est produite pendant l'opération !" }]
        });
    }

};