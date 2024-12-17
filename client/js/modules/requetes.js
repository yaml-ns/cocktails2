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



/*===================================*/

const updateRequest = ()=>{
  const cocktailModal = document.getElementById('updateCocktailModal')
  if (!cocktailModal) return;
  const updateBtn = cocktailModal.querySelector('#updateBtn')
  const erreurs = document.querySelector("#erreursCocktail");
  const form = document.querySelector("#updateCocktailForm");

  let cocktailIdToUpdate = null;

  updateBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (cocktailIdToUpdate) {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      updateCocktail(cocktailIdToUpdate, data)
          .then((res) => {
            if (res.ok){
              requeteListerCocktails().then(() => {
                const modalInstance  = bootstrap.Modal.getOrCreateInstance(cocktailModal)
                modalInstance.hide();
              });
            }else{
              displayErrors(erreurs,res.errors)
            }
          })
          .catch((err) => {
            console.error('Erreur lors de la mise a jour ', err)
            displayErrors(erreurs,err)
          });
    }
  });

  document.body.addEventListener('click', (e) => {
    const updateButton = e.target.closest('[data-bs-type="update"]');

    if (updateButton) {
      const cocktailId = updateButton.getAttribute('data-bs-id');
      const cocktailName = updateButton.getAttribute('data-bs-name');

      cocktailIdToUpdate = cocktailId;
      const modalTitle = cocktailModal.querySelector('#cocktailModalTitle');
      modalTitle.textContent = `Mettre à jour un cocktail ${cocktailName}`;
      updateBtn.textContent = `Mettre à jour`;
      erreurs.innerHTML="";

      fetchCocktail(cocktailId).then((cocktail)=> {
        document.querySelector("#name").value = cocktail.nom;
        document.querySelector("#prix").value = cocktail.prix;
        document.querySelector("#type").value = cocktail.type.toLowerCase();
        document.querySelector("#ingredients").value = cocktail.ingredients.join(", ");

        const modalInstance  = bootstrap.Modal.getOrCreateInstance(cocktailModal)
        modalInstance.show();
      }).catch((err)=>{
        console.log(err)
        displayErrors(erreurs,err)
      })
    }
  });


  cocktailModal.addEventListener('hidden.bs.modal', ()=> {form.reset()})
}

const createRequest = ()=>{
  const createCocktailModal = document.getElementById('createCocktailModal')
  if (!createCocktailModal) return;
  const registerBtn = createCocktailModal.querySelector('#registerBtn')
  const erreurs = document.querySelector("#erreursCreateCocktail");
  const form = document.querySelector("#createCocktailForm");

  registerBtn.addEventListener('click', (e) => {
    e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      createCocktail(data)
          .then((res) => {
            if (res.ok){
              requeteListerCocktails().then(() => {
                const modalInstance  = bootstrap.Modal.getOrCreateInstance(createCocktailModal)
                modalInstance.hide();
              });
            }else{
              displayErrors(erreurs,res.errors)
            }
          })
          .catch((err) => {
            console.error('Erreur lors de la création.', err)
            displayErrors(erreurs,"Erreur lors de la création.")
          });
  });

  document.body.addEventListener('click', (e) => {
    const addButton = e.target.closest('[data-bs-type="new"]');

    if (addButton) {
      registerBtn.textContent = `Ajouter un cocktail`;
      erreurs.innerHTML="";
      form.reset();

    }
  });


  createCocktailModal.addEventListener('hidden.bs.modal', ()=> {form.reset()})
}
const deleteRequest = ()=>{
  const cocktailDeleteModal = document.getElementById('cocktailDeleteModal');
  if (!cocktailDeleteModal) return;
  const deleteBtn = cocktailDeleteModal.querySelector('#deleteBtn');
  let cocktailIdToDelete = null;

  deleteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (cocktailIdToDelete) {
      deleteCocktail(cocktailIdToDelete)
          .then(() => {
            requeteListerCocktails().then(() => {
              const modalInstance  = bootstrap.Modal.getOrCreateInstance(cocktailDeleteModal)
              modalInstance.hide();
            });
          })
          .catch((err) => console.error('Erreur lors de la suppression', err));
    }
  });


  document.body.addEventListener('click', (e) => {
    const button = e.target.closest('[data-bs-type="delete"]');

    if (button) {
      const cocktailId = button.getAttribute('data-bs-id');
      const cocktailName = button.getAttribute('data-bs-name');

      cocktailIdToDelete = cocktailId;
      const modalName = cocktailDeleteModal.querySelector('#cocktailName');
      const modalTitle = cocktailDeleteModal.querySelector('#cocktailDeleteModalTitle');

      modalName.textContent = cocktailName;
      modalTitle.textContent = `Supprimer ${cocktailName}`;

      const modalInstance  = bootstrap.Modal.getOrCreateInstance(cocktailDeleteModal)
      modalInstance.show();
    }
  });
}
const fetchCocktail = async (id)=>{
  const res = await fetch(`/cocktails/${id}`)
  return res.json();
}

const createCocktail = async (data)=>{

  const res = await fetch(`/cocktails`,{
    method: "post",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  return res.json();
}
const updateCocktail = async (id,data)=>{
  const res = await fetch(`/cocktails/${id}`,{
    method: "put",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  return res.json();
}
const deleteCocktail = async (id)=>{
  const res = await fetch(`/cocktails/${id}`,{
    method: "delete",
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return res.json();
}



const displayErrors = (elem, errors)=>{
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

export {requeteListerCocktails, requeteAvecFiltres, register, login, updateRequest, deleteRequest, createRequest};
