import connexion from "../../services/connexion.js";

export const getAll = async (filters)=>{
    return await filteredCocktails(filters)
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
    const [result] = await connexion.query(`INSERT INTO cocktails 
                                               (nom, type, prix, image) VALUES(?,?,?,"https://www.thecocktaildb.com/images/media/drink/ewjxui1504820428.jpg")`,
        [cocktail.nom, cocktail.type, cocktail.prix]
    )
    if (result.affectedRows > 0 ){
        const values = cocktail.ingredients.map((ingredient) => [result.insertId,ingredient]);
        const query = `INSERT INTO ingredients (cocktail_id,ingredient) VALUES ?`
        await connexion.query(query,[values]);
        return result.affectedRows
    }
    return 0;

}

export const update = async (cocktail)=>{
    await connexion.query(`DELETE FROM ingredients WHERE cocktail_id = ?`,cocktail.id);
    const rows = await connexion.query(`UPDATE cocktails 
                                               SET nom = ?, type = ?, prix = ?
                                               WHERE id = ?`,
                                               [cocktail.nom, cocktail.type, cocktail.prix, cocktail.id]
                                               )
    if (cocktail.ingredients.length > 0){
        const values = cocktail.ingredients.map((ingredient) => [cocktail.id,ingredient, ]);
        const query = `INSERT INTO ingredients (cocktail_id,ingredient) VALUES ?`
        await connexion.query(query,[values]);
    }
    return rows[0].affectedRows;
}

const filteredCocktails = async (filters)=>{

    const { id, nom, ingredient, minPrix,maxPrix, orderBy, order, page=1, perPage, last } = filters;

    const limit = parseInt(perPage)
    let offset = (page - 1) * limit;
    let query = `  FROM cocktails c 
                          LEFT JOIN ingredients i 
                          ON c.id = i.cocktail_id
                          WHERE 1
                          `
    const params = []



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

    const countQuery = "SELECT COUNT(DISTINCT c.id) AS total " + query;
    const [result] = await connexion.query(countQuery,params)
    const total  = result[0].total;
    if (total === 0){
        return {
            result:[],
            pagination: {
                page:1,
                totalPages:1,
                hasNextPage: false,
                hasPreviousPage: false
            }
        }
    }
    const totalPages = Math.ceil(total / limit);
    if (last ==="true") offset = (totalPages - 1) * limit;
    const fetchQuery = "SELECT DISTINCT c.*" + query + ` LIMIT ? OFFSET ? `;
    params.push(limit)
    params.push(offset)
    const results =  await connexion.query(fetchQuery, params);
    const cocktailIds = results[0].map((c)=> c.id);
    const [ingRows] = await connexion.query("SELECT * FROM ingredients WHERE cocktail_id IN (?) ",[cocktailIds])
    const res = results[0].map((cock)=>{
        return {
            ...cock,
            ingredients: ingRows.filter((i)=> cock.id === i.cocktail_id)
        }
    })

    return {
        result:res,
        pagination: {
            page: last === "true" ? totalPages : page,
            totalPages,
            hasNextPage: last === true ? false : page < totalPages,
            hasPreviousPage: page > 1
        }
    }
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
