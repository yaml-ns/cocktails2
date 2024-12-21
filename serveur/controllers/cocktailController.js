import {deleteById, getAll, getById, create, getByName, update, getOneCocktail} from "../models/cocktailModel.js";
import fs from "node:fs";
import {fileURLToPath} from "url";
import path from "path";


export const getCocktails = async (req,res)=>{
    const filters = req.query
    try{
        const cocktails = await getAll(filters,req);
        res.statusCode = 200;
        res.json({
            ok:true,
            result: cocktails.result,
            pagination:cocktails.pagination

        })
    }catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.json({error:"une erreur s'est produite"});
    }

}

export const createCocktail = async (req,res)=>{
    const cocktail = req.body;
    try {
        const cocktail_existe = await getByName(cocktail.nom)
        if (cocktail_existe){
            res.statusCode = 400;
            res.json({ok:false,errors: "Un cocktail du même nom existe déjà !"})
        }else{

                cocktail.image = req.file ? req.file.filename: null;
            const r = await create(cocktail)
            if (r===1){
                res.statusCode = 201;
                res.json({ok:true,message:"Cocktail crée avec succès"})
            }else{
                console.log(e);
                res.statusCode = 500;
                res.json({ok:false, errors:"une erreur s'est produite"});
            }
        }
    }catch (e){
        console.log(e);
        res.statusCode = 500;
        res.json({ok:false, errors:"une erreur s'est produite"});

    }
}
export const getCocktail = async (req,res)=>{
    const cocktail = await getById(parseInt(req.params.id),req)
    if (cocktail){
        res.json(cocktail)
    }else{
        res.statusCode = 404
        res.json({status: "erreur", message:"Oups ! Cocktail non trouvé."})
    }
}
export const updateCocktail = async (req,res)=>{
    const cocktail_exists = await getOneCocktail(parseInt(req.params.id))
    const cocktail = req.body

    if (cocktail_exists){
        try {
            cocktail.id = cocktail_exists.id
            if (req.file){
                const __filename = fileURLToPath(import.meta.url);
                const __dirname = path.dirname(__filename);
                const image_path = path.join(__dirname,"../../" ,'client/uploads/images/cocktail/'+cocktail_exists.image)
                cocktail.image = req.file.filename;
                if (cocktail_exists.image){
                    if (fs.existsSync(image_path)) {
                        await fs.promises.unlink(image_path);
                    }
                }
            }
            cocktail.image = req.file ? req.file.filename: cocktail_exists.image;

            const result = await update(cocktail)
            if (result >=1){
                res.statusCode = 200;
                res.json({ok:true,message:"Cocktail mis à jour avec succès !"})
            }
        }catch (e){
            console.log(e)
            res.statusCode = 500
            res.json({ok:false,message:"Une erreur est survenue !"})
        }
    }else{
    res.statusCode = 400
    res.json({ok:false,message:"Cocktail non trouvé !"})
    }
}

export const deleteCocktail = async (req,res)=>{
    const cocktail = await getById(parseInt(req.params.id),req)
    if (!cocktail){
        res.statusCode = 404;
        res.json({status: "erreur", message:"Cocktail non trouvé !"})
    }else{
        await deleteById(cocktail.id)
        res.json({
            status: 200,
            message: `Le cocktail ${req.params.id} a bien été supprimé`
        })
    }
}