import { afficherPage, genererPagination } from "./pagination.js";

const creerCard = (cocktail) => {
    let ingredients = "";
    for (let ingredient of cocktail.ingredients){
        ingredients += `<span class="badge me-1 text-bg-dark">${ingredient}</span>`
    }

    return `
                <div class="card h-100" data-ref="${cocktail.id}">
                    <img src="${
                      cocktail.image
                    }" class="card-img-top " alt="Cocktail ${cocktail.name}">
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

const afficherListeCocktailsCards = (cocktails) => {
    let listeCards = "";
    for (const cocktail of cocktails) {
      listeCards += creerCard(cocktail);
    }
    document.getElementById("contenu").innerHTML = listeCards;
}

 
const afficherCocktailsParPagination = (cocktails) => {
  // Pagination
  const nbCocktailsPage = 10;
  let pageCourrante = 1;

  // Afficher la première page de la liste
  afficherPage(cocktails, pageCourrante, nbCocktailsPage, afficherListeCocktailsCards);

  // Générer les boutons de pagination
  genererPagination(
    cocktails,
    nbCocktailsPage,
    afficherPage,
    afficherListeCocktailsCards,
    pageCourrante
  );
};

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

export { afficherListeCocktailsCards,afficherDetailsCocktail, afficherCocktailsParPagination };