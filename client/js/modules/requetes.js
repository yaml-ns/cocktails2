import {afficherListeCocktailsCards, afficherListeCocktailsCardsAdmin} from "./affichage.js";


const isAdmin = document.querySelector("#admin")
let totalPages = null;
let currentPage = null;
const listCocktails = async (page=1, filtres, last= false)=>{
  const perPage = isAdmin ? 4 : 10;
  const queryParams = new URLSearchParams({ page, ...filtres, perPage, last });
  const url = `http://127.0.0.1:3000/cocktails?${queryParams.toString()}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données");
    }
    const jsonResponse = await response.json();
    totalPages = jsonResponse.pagination.totalPages;
    currentPage = jsonResponse.pagination.page;
      isAdmin ? afficherListeCocktailsCardsAdmin(jsonResponse.result)
              : afficherListeCocktailsCards(jsonResponse.result)
      updatePagination(jsonResponse.pagination)
  } catch (erreur) {
    console.log("Erreur lors de la requête:", erreur);
    return [];
  }
}

function updatePagination(p,filtres) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = ""; // Réinitialiser la pagination

  const maxButtons = 5;

  const prevButton = document.createElement("button");
  prevButton.className = `btn btn-outline-primary me-1 ${parseInt(p.page) === 1 ? "disabled" : ""}`;
  prevButton.innerHTML = `<i class="bi bi-chevron-double-left"></i>`;
  prevButton.addEventListener("click", async (e) => {
    e.preventDefault();
    if (p.hasPreviousPage){
      await listCocktails(parseInt(p.page) - 1,filtres)
    }
  });
  pagination.appendChild(prevButton);

  let startPage = Math.max(currentPage - Math.floor(maxButtons / 2), 1);
  let endPage = Math.min(startPage + maxButtons - 1, p.totalPages);

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(endPage - maxButtons + 1, 1);
  }

  for (let i = startPage; i <= parseInt(p.totalPages); i++) {
    const pageButton = document.createElement("button");
    pageButton.className = `btn btn-outline-primary me-1 page ${i === parseInt(p.page) ? "active disabled" : ""}`;
    pageButton.innerHTML = `${i}`;
    pageButton.addEventListener("click", async (e) => {
      e.preventDefault();
      await listCocktails(i,filtres)
    });
    pagination.appendChild(pageButton);
  }


  if (endPage < p.totalPages) {
    const ellipsis = document.createElement('span');
    ellipsis.textContent = '...';
    ellipsis.classList.add('me-2');
    pagination.appendChild(ellipsis);
  }

  const nextButton = document.createElement("button");
  nextButton.className = `btn btn-outline-primary me-1 ${parseInt(p.page) === parseInt(p.totalPages) ? "disabled" : ""}`;
  nextButton.innerHTML = `<i class="bi bi-chevron-double-right"></i>`;
  nextButton.addEventListener("click", async (e) => {
    e.preventDefault();
    if (p.hasNextPage){
      await listCocktails(parseInt(p.page) + 1,filtres)
    }
  });
  pagination.appendChild(nextButton);
}

const form = document.getElementById("filter");
const fields = form.querySelectorAll("input, select");
fields.forEach((field) => {
  field.addEventListener("input", async () => {
    const formData = new FormData(form);
    const filters = Object.fromEntries(formData.entries());

    await listCocktails(1, filters);
  });
});


/*===================================*/

function addIngredient(ingredientsList) {
  const i = document.createElement("i")
  i.classList.add("deleteIngredient");
  i.setAttribute("data-bs-type", "deleteIng")
  i.textContent = "X";
  const input = document.createElement("input")
  input.setAttribute("type", "text")
  input.setAttribute("name", "ingredients[]")
  input.setAttribute("required", "required")
  input.classList.add("form-control")

  const elem = document.createElement("div");
  elem.classList.add("mb-3");
  elem.classList.add("input-group");
  elem.classList.add("align-items-center");
  elem.appendChild(input)
  elem.appendChild(i)
  ingredientsList.appendChild(elem);
}

const handleCreateUpdateRequests = ()=>{
  const cocktailModal = document.getElementById('cocktailModal')
  if (!cocktailModal) return;
  const processBtn = cocktailModal.querySelector('#processBtn')
  const erreurs = document.querySelector("#cocktailErrors");
  const form = document.querySelector("#cocktailForm");

  let cocktailIdToUpdate = null;

  processBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const btnType = processBtn.dataset.type;
      if (btnType ==="update"){

        if (cocktailIdToUpdate) {

          const formData = new FormData(form);

          updateCocktail(cocktailIdToUpdate, formData)
              .then((res) => {
                if (res.ok){
                  showToastSuccess("Cocktail mis à jour avec succès !")
                  listCocktails(currentPage).then(() => {
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
      }

      if (btnType === "new"){
        const createFormData = new FormData(form);
        createCocktail(createFormData)
            .then((res) => {
              console.log(createFormData)
              if (res.ok){
                showToastSuccess("Cocktail créé avec succès")
                listCocktails(currentPage,null,true).then(() => {
                  const modalInstance  = bootstrap.Modal.getOrCreateInstance(cocktailModal)
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
      }


  });

  document.body.addEventListener('click', (e) => {

    const updateButton = e.target.closest('[data-bs-type="update"]');
    const addButton = e.target.closest('[data-bs-type="new"]');
    const processBtn = document.querySelector("#processBtn")
    const ingredientsList = document.querySelector("#ingredientsList");

    if (updateButton) {
      processBtn.dataset.type = "update";
      const cocktailId = updateButton.getAttribute('data-bs-id');
      const cocktailName = updateButton.getAttribute('data-bs-name');



      cocktailIdToUpdate = cocktailId;
      const modalTitle = cocktailModal.querySelector('#cocktailModalTitle');
      modalTitle.textContent = `Mettre à jour un cocktail ${cocktailName}`;
      processBtn.textContent = `Mettre à jour`;
      erreurs.innerHTML="";

      fetchCocktail(cocktailId).then((cocktail)=> {
        document.querySelector("#name").value = cocktail.nom;
        document.querySelector("#prix").value = cocktail.prix;
        document.querySelector("#type").value = cocktail.type.toLowerCase();
        document.querySelector("#imagePreview").src = cocktail.image;


        let list = "";
        cocktail.ingredients.map((ing)=>{
          list += `
                    <div class="mb-3 input-group align-items-center">
                        <input type="text" name="ingredients[]"  class="form-control" aria-describedby="ingredientsHelpBlock"
                               value="${ing}" required>
                               <i class="deleteIngredient" data-bs-type="deleteIng">X</i>
                    </div>
          `
        })
        ingredientsList.innerHTML = list


        const modalInstance  = bootstrap.Modal.getOrCreateInstance(cocktailModal)
        modalInstance.show();
      }).catch((err)=>{
        console.log(err)
        displayErrors(erreurs,err)
      })
    }
    if (addButton){
      processBtn.dataset.type = "new";
      const modalTitle = cocktailModal.querySelector('#cocktailModalTitle');
      modalTitle.textContent = `Ajouter un cocktail`;
      processBtn.textContent = `Ajouter cocktail`;
      erreurs.innerHTML="";
    }

    const deleteIngButton =  e.target.closest('[data-bs-type="deleteIng"]');
    const addIngButton =  e.target.closest('[data-bs-type="addIng"]');
    if (deleteIngButton){
      deleteIngButton.closest(".input-group").remove();
    }

    if (addIngButton){
      addIngredient(ingredientsList);
    }
  });


  cocktailModal.addEventListener('hidden.bs.modal', (e)=> {
    form.reset()
    cocktailModal.querySelector("#imagePreview").setAttribute("src","/images/bg/no_image.jpg")
    cocktailModal.querySelector("#cocktailModalTitle").textContent = "Ajouter un Cocktail";
    cocktailModal.querySelector('#processBtn').value = "Enregistrer"
    cocktailModal.querySelector("#cocktailErrors").innerHTML="";
    cocktailModal.querySelector("#ingredientsList").innerHTML="";
  })
}

const deleteRequest = ()=>{

  const cocktailDeleteModal = document.getElementById('cocktailDeleteModal');

  if (!cocktailDeleteModal) return;
  const deleteBtn = cocktailDeleteModal.querySelector('#deleteBtn');
  let cocktailIdToDelete = null;
  deleteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const last = parseInt(currentPage) === parseInt(totalPages);
    if (cocktailIdToDelete) {

      deleteCocktail(cocktailIdToDelete)
          .then(() => {
            const form = document.querySelector("#filter");
            const formData = new FormData(form);
            const filters = Object.fromEntries(formData.entries());

            showToastSuccess("Cocktail supprimé avec succès")
            listCocktails(currentPage, filters, last ).then(() => {
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
    body: data
  })
  return res.json();
}
const updateCocktail = async (id,data)=>{
  const res = await fetch(`/cocktails/${id}`,{
    method: "put",
    body: data
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
  listCocktails,
  register,
  login,
  handleCreateUpdateRequests,
  deleteRequest
};
