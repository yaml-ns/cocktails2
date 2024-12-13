import {deleteById, getAll, getById} from "../models/cocktailModel.js";
import {readData, writeData} from "../../services/cocktailDataReader.js";


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
        const cocktails = await readData();
        cocktails.push(cocktail)
        await writeData(JSON.stringify(cocktails,null,2))
        res.statusCode = 201;
        res.json(cocktail)
    }catch (e){
        console.log(e);
        res.statusCode = 500;
        res.json({error:"une erreur s'est produite"});
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

export const deleteCocktail = async (req,res)=>{
    const cocktail = await getById(parseInt(req.params.id))
    if (!cocktail){
        res.statusCode = 404;
        res.json({status: "erreur", message:"Not found"})
    }else{
        await deleteById(cocktail.id)
        res.json({
            status: 200,
            message: `Le cocktail ${req.params.id} a bien été supprimé`
        })
    }
}