const createFrontCard = (cocktail) => {
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
                    <h4 class="card-title mb-0">${cocktail.name.substring(0, 25)}</h4>
                    <p class="mb-2 fst-italic fs-6 text-secondary">${cocktail.category}</p>
                    <hr class="m-0">
                    <p class="card-text mb-0"><span class="badge m-1 text-bg-secondary">🍸 ${cocktail.glass}</span></p>
                    <hr class="m-0">
                    <div class="mt-4" style="min-height: 100px">${ingredients}</div>
                    <div class="row">
                        <div class="col">
                            <span class="badge m-1 text-bg-dark">${cocktail.price} $</span>
                        </div>
                        <div class="col d-flex justify-content-end align-content-stretch">
                            <a href="#" class="btn btn-dark" >Détails</a>
                        </div>
                    </div>
                </div>
            </div>
`;
}
const createAdminCard = (cocktail) => {
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
                    <button class="btn btn-sm btn-primary btn-modifier" 
                    title="Modifier le cocktail"
                    data-bs-toggle="modal" 
                    data-bs-target="#cocktailModal"
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
      listeCards += createFrontCard(cocktail);
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
      listeCards += createAdminCard(cocktail);
    }
    document.getElementById("contenu").innerHTML = listeCards;
}

 


const  showCocktailDetails = (cocktail)=>{
    let ingredients = "";
    for (let ingredient of cocktail.ingredients){
        if (ingredient.ingredient){
            const amount = ingredient.amount?`(${ingredient.amount}${ingredient.unit||""})`:"";
            const label = ingredient.label || ingredient.special ?`  ${ingredient.label || ""} ${ingredient.special || ""}`:"";
            ingredients += `<li class="ingredient"> <span class="ingredient-name"> <i class="bi bi-record-circle"></i> <b>${ingredient.ingredient}</b> ${ amount }</span>${label} </li>`
        }
    }
    let colors = "";
    for (let color of cocktail.colors.split(",")){
        colors += `<span class="cocktail-color" style="background-color: ${color}"></span>`
    }
    return `
    <div class="container">
        <div class="row p-3 justify-content-between">
            <div class="col-7 d-flex flex-column justify-content-between p-5 detail-text">
                <h1 class="detail-title">${cocktail.name} <span class="badge bg-warning-subtle text-info">${cocktail.price} $</span> </h1>
                <div>
                    <h2>Les ingrédients</h2>
                    <ul class="ingredients">
                        ${ingredients}
                    </ul>        
                </div>
                <div class="mt-4">
                   <h2>Garniture</h2>
                   <p>${cocktail.garnish || "Aucune garniture"}</p>
                </div>
                <div class="mt-4">
                   <h2>Préparation</h2>
                   <p>${cocktail.preparation}</p>
                </div>
            </div>
            
            <div class="col-4 d-flex flex-column justify-content-between p-0 rounded-4 overflow-hidden detail-card">
                    <img height="450" src="${cocktail.image}" alt="${cocktail.name}">
                    <div class="p-5">
                        <div class="mt-2 card-line">
                            <p class="d-flex align-items-center"><span class="me-2">Couleurs : </span> ${colors}</p>
                        </div>
                        <div class="mt-2 card-line">
                            <p class="d-flex align-items-center"><span class="me-2">Catégorie : </span> ${cocktail.category}</p>
                        </div>
                        <div class="mt-2 card-line">
                            <p class="d-flex align-items-center"><span class="me-2"> Verre 🍸 : </span> ${cocktail.glass}</p>
                        </div>
                    </div>
                   
                        <div class="d-flex justify-content-center align-content-stretch flex-column m-3">
                            <button class="btn btn-warning"><b><i class="bi bi-cart3"></i> Ajouter au pagner</b></button>
                        </div>
            </div>
        </div>
    </div>
    `
}

export const displayErrors = (elem, errors)=>{
    elem.textContent = "";
    if (Array.isArray(errors)){
        elem.innerHTML = errors
            .map((err) => {
                return `<p class="alert alert-danger" role="alert">
                                <i class="bi bi-exclamation-triangle-fill text-danger"></i>
                                ${err.msg}
                               </p>`
            }).join("");
    }else{
        elem.innerHTML = `<p class="alert alert-danger" role="alert">
                        <i class="bi bi-exclamation-triangle-fill text-danger"></i>
                        ${errors}
                      </p>`;
    }
}
const showToastSuccess = (message) =>{
    const toastEl = document.getElementById('toastSuccess');
    const toastBody = toastEl.querySelector('#toastMessage');
    toastBody.textContent = message || "Opération réussie !";
    const toast = new bootstrap.Toast(toastEl,{
        animation: true,
        autohide: true,
        delay: 3000
    });
    toast.show();
}

const showToastError = (message) =>{
    const toastEl = document.getElementById('toastError');
    const toastBody = toastEl.querySelector('.toast-body');
    toastBody.textContent = message || "Une erreur est survenue.";
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

export {
    afficherListeCocktailsCardsAdmin,
    afficherListeCocktailsCards,
    showCocktailDetails,
    showToastSuccess,
    showToastError
};