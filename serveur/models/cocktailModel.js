import {readData, writeData} from "../../services/cocktailDataReader.js";
import connexion from "../../services/connexion.js";

const processRows = async (rows)=> {

    const cocktails = []
    let cocktail = null;
    rows.forEach(row => {
        if (cocktail === null || cocktail.id !== row.id) {
            cocktail = {
                id: row.id,
                nom: row.nom,
                type: row.type,
                prix: row.prix,
                image: row.image,
                ingredients: []
            };
            cocktails.push(cocktail);
        }
        if (row.ingredient) {
            cocktail.ingredients.push(row.ingredient);
        }
    });
    return cocktails
}

export const getAll = async (filters)=>{
    const [rows] = await connexion.query(`SELECT c.*, i.ingredient FROM cocktails c 
                                          LEFT JOIN ingredients i 
                                          ON c.id = i.cocktail_id`);

    return await processRows(rows);
}
export const getById = async (id)=>{
    const rows = await connexion.query(`SELECT c.*, i.ingredient FROM cocktails c 
                                          LEFT JOIN ingredients i 
                                          ON c.id = i.cocktail_id
                                          WHERE c.id = ?`,[id])
    const cocktails = await processRows(rows[0]);
    return cocktails[0];
}

export const deleteById = async (id)=>{
    const rows = await connexion.query(`SELECT FROM WHERE cocktails.id = ?`,[id])
    console.log()
}

export const createCocktail = async (cocktail)=>{
    const cocktails = await readData();
    cocktails.push(cocktail)
    await writeData(JSON.stringify(cocktails))
}


function filter(data, filters){
    const { id, nom, ingredient,alcohol, minPrix,maxPrix, orderBy, order } = filters;
    let results = data;

    if (id){
        results = results.filter( cocktail =>  cocktail.id === parseInt(id));
    }
    if (nom){
        results = results.filter(cocktail=> {
            const pos = cocktail.nom.toLowerCase().indexOf(nom.toLowerCase());
            return pos !==-1;
        });
    }

    if (ingredient){
        results = results.filter(cocktail =>
            cocktail.ingredients.some(ing => ing.toLowerCase().includes(ingredient.toLowerCase()))
        );
    }
    if (minPrix){
        results = results.filter(cocktail => cocktail.prix >= parseFloat(minPrix))
    }
    if (maxPrix){
        results = results.filter(cocktail => cocktail.prix <= parseFloat(maxPrix))
    }

    sortCocktails(results,orderBy,order)

    return results

}

function sortCocktails(data,orderBy,order = "ASC"){

    if (!orderBy) return data;

    const isAscending = order.toUpperCase() === 'ASC' || order.trim() ==="";

    return data.sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return isAscending ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return isAscending ? 1 : -1;
        }
        return 0;
    });
}
