import { afficherCocktailsParPagination } from "./affichage.js";


const isAdmin = document.querySelector("#admin")
const requeteListerCocktails = async () => {

  try {
    const response = await fetch("http://127.0.0.1:3000/cocktails");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données");
    }
    const cocktails = await response.json();
    afficherCocktailsParPagination(cocktails,isAdmin);
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
      $('#contenu').empty();
      if (data.length > 0) {
        afficherCocktailsParPagination(data,isAdmin)

      } else {
        $('#contenu').append('<p class="text-center">Aucun cocktail trouvé</p>');
      }
    },
    error: function (error) {
      console.error('Erreur lors de la requête:', error);
    }
  });
}

const register = ()=>{
  const form = document.querySelector("#inscriptionForm");
  const erreurs = document.querySelector("#erreursInscription");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    try {
      fetch('/membres/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((response)=>{
        response.json().then((result)=>{
          if (!response.ok) {
            erreurs.innerHTML = result.errors
                .map((err) => {
                      return `<p class="alert alert-danger" role="alert">
                                <i class="bi bi-exclamation-triangle-fill text-danger"></i>
                                ${err.msg}
                               </p>`
                }).join("");
          } else {
            alert('Login réussie !');
            form.reset();
          }
        });
      });

    } catch (error) {
      console.error('Erreur lors de l\'inscription', error);
      erreurs.textContent = 'Une erreur est survenue.';
    }

  })

}
const login = ()=>{
  const form = document.querySelector("#loginForm");
  const erreurs = document.querySelector("#erreursLogin");

  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    try {
      fetch('/membres/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((response)=>{
        response.json().then((result)=>{
          if (!response.ok) {
            erreurs.innerHTML = result.errors
                .map((err) => {
                  return `<p class="alert alert-danger" role="alert">
                                <i class="bi bi-exclamation-triangle-fill text-danger"></i>
                                ${err.msg}
                               </p>`
                }).join("");
          } else {
            alert("Vous êtes connecté !")
            form.reset();
          }
        });


      });

    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      erreurs.innerHTML = `<p class="alert alert-danger" role="alert">Une erreur est survenue.</p>`;
    }

  })

}

export { requeteListerCocktails, requeteAvecFiltres,register,login };
