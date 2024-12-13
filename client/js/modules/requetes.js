import { afficherCocktailsParPagination } from "./affichage.js";

// Récupérer la liste des éléments
const requeteListerCocktails = async () => {
  try {
    const response = await fetch("http://127.0.0.1:3000/cocktails");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données");
    }
    const cocktails = await response.json();
    afficherCocktailsParPagination(cocktails);
  } catch (erreur) {
    console.log("Erreur lors de la requête:", erreur);
    return [];
  }
};

function requeteAvecFiltres() {

  const id = document.querySelector('#id').value;
  const nom = document.querySelector('#nom').value;
  const order = document.querySelector('#order').value;
  const orderBy = document.querySelector('#orderBy').value;
  const minPrix = document.querySelector('#minPrix').value;
  const maxPrix = document.querySelector('#maxPrix').value;
  const ingredient = document.querySelector('#ingredient').value;

  $.ajax({
    url: '/cocktails',
    type: 'GET',
    data: { id, nom, ingredient, minPrix, maxPrix, orderBy, order },
    success: function (data) {
      console.log(data)

      $('#contenu').empty();
      if (data.length > 0) {
        afficherCocktailsParPagination(data)

      } else {
        $('#contenu').append('<p class="text-center">Aucun cocktail trouvé</p>');
      }
    },
    error: function (error) {
      console.error('Erreur lors de la requête:', error);
    }
  });
}

export { requeteListerCocktails, requeteAvecFiltres };
