import {readData, writeData} from "../../services/cocktailDataReader.js";
import connexion from "../../services/connexion.js";

export const getAll = async (filters)=>{
    const [rows] = await filteredCocktails(filters)
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

export const getByName = async (name)=>{

    const rows = await connexion.query(`SELECT c.*, i.ingredient FROM cocktails c 
                                          LEFT JOIN ingredients i 
                                          ON c.id = i.cocktail_id
                                          WHERE c.nom = ?`,[name])
    const cocktails = await processRows(rows[0]);
    return cocktails[0];
}

export const deleteById = async (id)=>{
    const rows = await connexion.query(`DELETE FROM cocktails WHERE cocktails.id = ?`,[id])
    return rows[0].affectedRows
}

export const create = async (cocktail)=>{
    const cocktails = await readData();
    cocktails.push(cocktail)
    await writeData(JSON.stringify(cocktails))
}

export const update = async (cocktail)=>{
    const rows = await connexion.query(`UPDATE cocktails 
                                               SET nom = ?, type = ?, prix = ?
                                               WHERE id = ?`,
                                               [cocktail.nom, cocktail.type, cocktail.prix, cocktail.id]
                                               )
    return rows[0].affectedRows;
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

const filteredCocktails = async (filters)=>{
    let query = `SELECT c.*, i.ingredient FROM cocktails c 
                          LEFT JOIN ingredients i 
                          ON c.id = i.cocktail_id
                          WHERE 1
                          `
    const params = []
    const { id, nom, ingredient,alcohol, minPrix,maxPrix, orderBy, order } = filters;


    if (id){
        query += ` AND c.id = ?`;
        params.push(id)
    }
    if (nom){
        query += ` AND c.nom LIKE ?`;
        params.push(`${nom}%`)
    }

    if (ingredient){
        query += ` AND i.ingredient LIKE ?`;
        params.push(params.push(`%${ingredient}%`))
    }
    if (minPrix){
        query += ` AND c.prix >= ?`;
        params.push(minPrix)
    }
    if (maxPrix){
        query += ` AND c.prix <= ?`;
        params.push(maxPrix)
    }
    if (orderBy){
        query += ` Order By c.${orderBy}`;
        if (order){
            query += ` ${order}`;
        }
    }
    return connexion.query(query, params);
}

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
