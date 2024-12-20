import { afficherPage, genererPagination } from "./pagination.js";

const creerCard = (cocktail) => {
    let ingredients = "";
    for (let ingredient of cocktail.ingredients){
        ingredients += `<span class="badge me-1 text-bg-dark">${ingredient.ingredient}</span>`
    }

    return `
                <div class="card h-100" data-ref="${cocktail.id}">
                    <img src="${
                      cocktail.image
                    }" class="card-img-top " alt="Cocktail ${cocktail.nom}" height="200">
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title">${cocktail.nom.substring(0, 25)}</h6>
                        <div style="min-height: 100px">${ingredients}</div>
                        <div class="row">
                            <div class="col">
                                <span class="badge m-1 text-bg-info">${cocktail.prix} $</span>
                            </div>
                            <div class="col">
                                <a href="#" class="btn btn-dark" >Détail</a>
                            </div>
                        </div>
                    </div>
                </div>
`;
}
const creerCardAdmin = (cocktail) => {
    let ingredients = "";
    for (let ingredient of cocktail.ingredients){
        ingredients += `<span class="badge me-1 text-bg-dark">${ingredient.ingredient}</span>`
    }

    return `<div class="card-horizontal col-12" 
                    data-bs-toggle="modal" 
                    data-bs-target="#detailsCocktailModal"
                    data-cocktail-id="${cocktail.id}" >
                <img src="${cocktail.image}" class="card-img-top card-img" alt="${cocktail.nom}">
                <div class="card-body row">
                    <div class="col-3">
                        <h5 class="card-title">${cocktail.id} - ${cocktail.nom}</h5>
                    </div>
                    <div class="col-4">                   
                        <p class="card-text" style="text-align: left">${ingredients}</p>
                    </div>
                    <div class="col-3">
                        <p class="card-text" style="text-align: left;font-style: italic">${cocktail.type.toLowerCase()}</p>
                    </div>
                    <div class="col-2">
                        <p class="card-text" style="text-align: left; font-weight: bold">${cocktail.prix} $</p>
                    </div>
                </div>
                <div class="buttons">
                    <button class="btn btn-outline-primary btn-modifier" 
                    data-bs-toggle="modal" 
                    data-bs-target="#updateCocktailModal"
                    data-bs-type="update"
                    data-bs-id="${cocktail.id}"
                    data-bs-name="${cocktail.nom}"
                    >
                        <i class="bi bi-pencil" data-id="${cocktail.id}"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-supprimer" 
                    data-bs-toggle="modal" 
                    data-bs-target="#cocktailDeleteModal"
                    data-bs-type="delete"
                    data-bs-id="${cocktail.id}"
                    data-bs-name="${cocktail.nom}"
                    >
                        <i class="bi bi-trash" data-id="${cocktail.id}"></i>
                    </button>
                </div>
            </div>
`;
}

const afficherListeCocktailsCards = (cocktails) => {
    let listeCards = "";
    for (const cocktail of cocktails) {
      listeCards += creerCard(cocktail);
    }
    document.getElementById("contenu").innerHTML = listeCards;
}
const afficherListeCocktailsCardsAdmin = (cocktails) => {
    let listeCards ="";
    for (const cocktail of cocktails) {
      listeCards += creerCardAdmin(cocktail);
    }
    document.getElementById("contenu").innerHTML = listeCards;
}

 


const  afficherDetailsCocktail = (cocktail)=>{
    let ingredients = "";
    for (let ingredient of cocktail.ingredients){
        ingredients += `<li class="ingredient">${ingredient}</li>`
    }

    return `
    <div class="container">
        <div class="row p-3">
        <div class="col d-flex flex-column justify-content-between p-5 detail-text">
            <h1 class="detail-title">${cocktail.nom} <span class="badge bg-warning-subtle text-info">${cocktail.prix} $</span> </h1>
            <div>
                <h2>Les ingrédients</h2>
                <ul class="ingredients">
                    ${ingredients}
                </ul>        
            </div>
            <div class="row justify-content-center align-content-center">
                <button class="btn btn-warning">Acheter Maintenant</button>
            </div>
        </div>
        <div class="col">
            <img height="450" src="${cocktail.image}" alt="${cocktail.nom}">
        </div>
    </div>
    </div>
    `
}

export { afficherListeCocktailsCards,afficherListeCocktailsCardsAdmin,afficherDetailsCocktail };