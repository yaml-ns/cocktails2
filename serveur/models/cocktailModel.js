import {readData, writeData} from "../../services/cocktailDataReader.js";

export const getAll = async (filters)=>{
    const data =   await readData();
    return filter(data, filters)
}
export const getById = async (id)=>{
    const cocktails = await readData();
    return cocktails.find((item)=> item.id === id)
}

export const deleteById = async (id)=>{
    const cocktails = await readData();
    const index = cocktails.findIndex((item)=> item.id === id);
    cocktails.splice(index,1);
    await writeData(JSON.stringify(cocktails));
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
