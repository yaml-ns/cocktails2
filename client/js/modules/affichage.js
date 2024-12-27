import { afficherPage, genererPagination } from "./pagination.js";

const creerCard = (cocktail) => {
    const imgUrl = cocktail.image ??'/images/bg/non_disponible.png';
    let ingredients = "";
    for (let ingredient of cocktail.ingredients){
        ingredients += `<span class="badge me-1 text-bg-dark">${ingredient.ingredient}</span>`
    }

    return `
                <div class="card h-100" data-ref="${cocktail.id}">
                    <div class="card-image-container">
                        <img src="${imgUrl}" class="image-card-perso" alt="Cocktail ${cocktail.name}" height="200">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title">${cocktail.name.substring(0, 25)}</h6>
                        <div style="min-height: 100px">${ingredients}</div>
                        <div class="row">
                            <div class="col">
                                <span class="badge m-1 text-bg-info">${cocktail.price} $</span>
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
    const imgUrl = cocktail.image ??'/images/bg/non_disponible.png';

    let ingredients = "";
    for (let ingredient of cocktail.ingredients){
        ingredients += `<span class="badge me-1 bg-dark-subtle text-dark-emphasis ">${ingredient.ingredient}</span>`
    }
    let colorsBadges = "";
    if (cocktail.colors){
        const colors = cocktail.colors.split(",");
        colors.map((color)=>{
            colorsBadges += `<span class="badge me-1" style="background-color: ${color};width: 20px"></span>`
        })
    }

    return `<div class="card-horizontal col-12" 
                    data-bs-toggle="modal" 
                    data-bs-target="#detailsCocktailModal"
                    data-cocktail-id="${cocktail.id}" >
                <img src="${imgUrl}" class="card-img-top card-img" alt="${cocktail.name}">
                <div class="card-body row">
                    <div class="col-3 align-content-center">
                        <h5 class="card-title">${cocktail.id} - ${cocktail.name}</h5>
                    </div>
                    <div class="col-2 align-content-center">
                        <p id="colors" class="card-text" style="text-align: left;font-style: italic">${colorsBadges}</p>
                    </div>
                    <div class="col-3">                   
                        <p class="card-text" style="text-align: left">${ingredients}</p>
                    </div>
                    <div class="col-1 align-content-center">
                        <p class="card-text" style="text-align: left;">${cocktail.glass || ""}</p>
                    </div>
                    <div class="col-2">
                        <p class="card-text align-content-center" style="text-align: left;font-style: italic">${cocktail.category || ""}</p>
                    </div>
                    <div class="col-1 align-content-center">
                        <p class="card-text" style="text-align: left; font-weight: bold">${cocktail.price}</p>
                    </div>
                </div>
                <div class="buttons">
                    <button class="btn btn-sm btn-outline-primary btn-modifier" 
                    title="Modifier le cocktail"
                    data-bs-toggle="modal" 
                    data-bs-target="#updateCocktailModal"
                    data-bs-type="update"
                    data-bs-id="${cocktail.id}"
                    data-bs-name="${cocktail.name}"
                    >
                        <i class="bi bi-pencil" data-id="${cocktail.id}"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-supprimer" 
                    title="Supprimer le cocktail"
                    data-bs-toggle="modal" 
                    data-bs-target="#cocktailDeleteModal"
                    data-bs-type="delete"
                    data-bs-id="${cocktail.id}"
                    data-bs-name="${cocktail.name}"
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
    let listeCards =`
    <div class="card-horizontal col-12 entete">
                <div class="card-img-top card-img" style="max-height: 40px;"></div>
                <div class="card-body row">
                    <div class="col-3">
                        <p class="card-text fw-bold">Id - Nom</p>
                    </div>
                    <div class="col-2">
                        <p id="colors" class="card-text fw-bold" style="text-align: left;">Couleurs</p>
                    </div>
                    <div class="col-3">                   
                        <p class="card-text fw-bold" style="text-align: left">Ingrédients</p>
                    </div>
                    <div class="col-1">
                    <p class="card-text fw-bold" style="text-align: left">🍸 Verre</p>
                    </div>
                    <div class="col-2">
                        <p class="card-text fw-bold" style="text-align: left;">Catégorie</p>
                    </div>
                    <div class="col-1">
                        <p class="card-text fw-bold" style="text-align: left;">Prix($)</p>
                    </div>
                </div>
                <div style="min-width: 90px" class="fw-bold"><p class="card-text fw-bold">Actions</p></div>
            </div>
    `;
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
            <h1 class="detail-title">${cocktail.name} <span class="badge bg-warning-subtle text-info">${cocktail.price} $</span> </h1>
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
            <img height="450" src="${cocktail.image}" alt="${cocktail.name}">
        </div>
    </div>
    </div>
    `
}

export { afficherListeCocktailsCards,afficherListeCocktailsCardsAdmin,afficherDetailsCocktail };