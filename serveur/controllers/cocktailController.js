import {deleteById, getAll, getById, create, getByName, update} from "../models/cocktailModel.js";


export const getCocktails = async (req,res)=>{
    const filters = req.query
    try{
        const cocktails = await getAll(filters);
        res.statusCode = 200;
        res.json(cocktails)
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
            const r = await create(cocktail)
            if (r===1){
                res.statusCode = 201;
                res.json({ok:true,message:"Cocktail crée avec succès"})
            }
        }
    }catch (e){
        console.log(e);
        res.statusCode = 500;
        res.json({ok:false, errors:"une erreur s'est produite"});

    }
}
export const getCocktail = async (req,res)=>{
    const cocktail = await getById(parseInt(req.params.id))
    if (cocktail){
        res.json(cocktail)
    }else{
        res.statusCode = 404
        res.json({status: "erreur", message:"Oups ! Cocktail non trouvé."})
    }
}
export const updateCocktail = async (req,res)=>{
    const cocktail_exists = await getById(parseInt(req.params.id))
    const cocktail = req.body

    if (cocktail_exists){
        try {
            cocktail.id = cocktail_exists.id
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
    const cocktail = await getById(parseInt(req.params.id))
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