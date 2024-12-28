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
      showToastError("Erreur lors de la récupération des données")
    }
    const jsonResponse = await response.json();
    totalPages = jsonResponse.pagination.totalPages;
    currentPage = jsonResponse.pagination.page;
      isAdmin ? afficherListeCocktailsCardsAdmin(jsonResponse.result)
              : afficherListeCocktailsCards(jsonResponse.result)
      paginate(jsonResponse.pagination, filtres)
  } catch (erreur) {
    console.log(erreur)
    console.log("Erreur s'est produite lors de la requête:");
    return [];
  }
}

function paginate(p,filtres) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
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


const detailRequest = ()=>{
  const detailModal = document.getElementById('detailsCocktailModal')
  if (!detailModal) return;
  detailModal.addEventListener("shown.bs.modal",(e)=>{
      const target = e.relatedTarget;
      const title = detailModal.querySelector("#cocktailDetailModalTitle")
      const name = detailModal.querySelector("#cocktailDetailsName")
      const cocktailImage = detailModal.querySelector("#cocktailImage")
      const updateButton = detailModal.querySelector("#updateCocktail")
      const deleteButton = detailModal.querySelector("#deleteCocktail")
      getCocktail(target.dataset.cocktailId).then((response)=>{
        title.textContent = response.name
        cocktailImage.src = response.image
        name.textContent = response.name
        updateButton.dataset.bsId = response.id
        deleteButton.dataset.bsId = response.id
        updateButton.dataset.bsName = response.name
        deleteButton.dataset.bsName = response.name
      })

  })
}


// const handleCreateUpdateRequests = ()=>{
//   const cocktailModal = document.getElementById('cocktailModal')
//   if (!cocktailModal) return;
//   cocktailModal.addEventListener("show.bs.modal",()=>{
//     setIngredientListHeader()
//     setColorListHeader()
//   });
//
//   const processBtn = cocktailModal.querySelector('#processBtn')
//   const erreurs = document.querySelector("#cocktailErrors");
//   const form = document.querySelector("#cocktailForm");
//
//   let cocktailIdToUpdate = null;
//
//   processBtn.addEventListener('click', (e) => {
//     e.preventDefault();
//     const btnType = processBtn.dataset.type;
//       if (btnType ==="update") {
//         processBtn.innerHTML = `
//         <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
//         <span role="status">Loading...</span>`
//         if (cocktailIdToUpdate) {
//           const formData = new FormData(form);
//
//           updateCocktail(cocktailIdToUpdate, formData)
//               .then((res) => {
//                 if (res.ok) {
//                   showToastSuccess("Cocktail mis à jour avec succès !")
//                   listCocktails(currentPage).then(() => {
//                     const modalInstance = bootstrap.Modal.getOrCreateInstance(cocktailModal)
//                     modalInstance.hide();
//                   });
//                 } else {
//                   displayErrors(erreurs, res.errors)
//                 }
//               })
//               .catch((err) => {
//                 console.error('Erreur lors de la mise a jour ')
//                 displayErrors(erreurs, err)
//               });
//         }
//       }
//
//     if (btnType === "new") {
//       const createFormData = new FormData(form);
//       createCocktail(createFormData)
//           .then((res) => {
//               if (res.ok){
//                 showToastSuccess("Cocktail créé avec succès")
//                 listCocktails(currentPage,null,true).then(() => {
//                   const modalInstance  = bootstrap.Modal.getOrCreateInstance(cocktailModal)
//                   modalInstance.hide();
//                 });
//               }else{
//                 displayErrors(erreurs,res.errors)
//               }
//             })
//             .catch((err) => {
//               console.error('Erreur lors de la création.', err)
//               displayErrors(erreurs,"Erreur lors de la création.")
//             });
//       }
//
//
//   });
//
//   document.body.addEventListener('click', (e) => {
//
//     const updateButton = e.target.closest('[data-bs-type="update"]');
//     const addButton = e.target.closest('[data-bs-type="new"]');
//     const processBtn = document.querySelector("#processBtn")
//     const ingredientsList = document.querySelector("#ingredientsList");
//     const colors = cocktailModal.querySelector("#colors");
//     let ingredientListContent = "";
//
//
//
//     if (updateButton) {
//       processBtn.dataset.type = "update";
//       const cocktailId = updateButton.getAttribute('data-bs-id');
//       const cocktailName = updateButton.getAttribute('data-bs-name');
//       cocktailIdToUpdate = cocktailId;
//       const modalTitle = cocktailModal.querySelector('#cocktailModalTitle');
//       modalTitle.textContent = `Mettre à jour un cocktail ${cocktailName}`;
//       processBtn.textContent = `Mettre à jour`;
//       erreurs.innerHTML="";
//       colors.innerHTML="";
//
//       fetchCocktail(cocktailId).then((cocktail)=> {
//         document.querySelector("#name").value = cocktail.name;
//         document.querySelector("#prix").value = cocktail.price;
//         document.querySelector("#type").value = cocktail.category || "";
//         document.querySelector("#glass").value = cocktail.glass || "";
//         document.querySelector("#garnish").value = cocktail.garnish || "";
//         document.querySelector("#preparation").value = cocktail.preparation || "";
//         document.querySelector("#imagePreview").src = cocktail.image??"/images/bg/no_image.png";
//
//           cocktail.ingredients.map((ing,index)=>{
//             ingredientListContent += `
//                     <div class="row ingredient-row">
//                     <div class="col-3">
//                       <div class="input-group align-items-center">
//                           <input type="text" name="ingredients[${index}][ingredient]"  class="form-control  form-control-sm"
//                                  value="${ing.ingredient}" required>
//
//                       </div>
//                     </div>
//                     <div class="col-2">
//                         <div class="input-group align-items-center">
//                           <input type="text" name="ingredients[${index}][amount]"  class="form-control  form-control-sm"
//                                  value="${ing.amount || ''}" >
//
//                       </div>
//                     </div>
//                     <div class="col-1">
//                       <div class="input-group align-items-center">
//                           <input type="text" name="ingredients[${index}][unit]"  class="form-control  form-control-sm"
//                                  value="${ing.unit || ''}" >
//
//                       </div>
//                     </div>
//                     <div class="col-3">
//                         <div class="input-group align-items-center">
//                           <input type="text" name="ingredients[${index}][label]"  class="form-control  form-control-sm"
//                                  value="${ing.label || ''}" >
//
//                         </div>
//                     </div>
//
//                     <div class="col-3">
//                       <div class="input-group align-items-center">
//                           <input type="text" name="ingredients[${index}][special]"  class="form-control  form-control-sm"
//                                  value="${ing.special || ''}" >
//
//                       </div>
//                     </div>
//                     <span class="deleteIngredient" data-bs-type="deleteIng">x</span>
//                     </div>
//           `
//           })
//
//         let colorsListContent = "";
//         if (cocktail.colors){
//           cocktail.colors.split(",").map((color)=>{
//             colorsListContent += `
//         <div class="color-row">
//           <input type="color" name="colors[]"  class="" value="${color}" >
//           <span class="deleteColor">x</span>
//         </div>
//           `
//           })
//         }
//         ingredientsList.innerHTML = ingredientListContent
//         colors.innerHTML = colorsListContent
//
//         setIngredientListHeader()
//         setColorListHeader()
//
//         const modalInstance  = bootstrap.Modal.getOrCreateInstance(cocktailModal)
//         modalInstance.show();
//       }).catch((err)=>{
//         console.log(err)
//         displayErrors(erreurs,err)
//       })
//     }
//     if (addButton){
//       processBtn.dataset.type = "new";
//       const modalTitle = cocktailModal.querySelector('#cocktailModalTitle');
//       modalTitle.textContent = `Ajouter un cocktail`;
//       processBtn.textContent = `Ajouter cocktail`;
//       erreurs.innerHTML="";
//     }
//
//     const deleteIngButton =  e.target.closest('[data-bs-type="deleteIng"]');
//     const addIngButton =  e.target.closest('[data-bs-type="addIng"]');
//     const deleteColorButton =  e.target.closest('.deleteColor');
//     const addColorButton =  e.target.closest('#addColor');
//     if (deleteIngButton){
//       deleteIngButton.closest(".ingredient-row").remove();
//       setIngredientListHeader()
//     }
//  if (deleteColorButton){
//       deleteColorButton.closest(".color-row").remove();
//       setColorListHeader()
//     }
//
//     if (addIngButton){
//       addIngredient(ingredientsList);
//     }
//     if (addColorButton){
//       addColor(colors);
//     }
//   });
//
//
//   cocktailModal.addEventListener('hidden.bs.modal', ()=> {
//     form.reset()
//     cocktailModal.querySelector("#imagePreview").setAttribute("src","/images/bg/non_disponible.png")
//     cocktailModal.querySelector("#cocktailModalTitle").textContent = "Ajouter un Cocktail";
//     cocktailModal.querySelector('#processBtn').value = "Enregistrer"
//     cocktailModal.querySelector("#cocktailErrors").innerHTML="";
//     cocktailModal.querySelector("#ingredientsList").innerHTML="";
//     cocktailModal.querySelector("#colors").innerHTML="";
//     cocktailModal.querySelector("#colorListHeader").classList.add("d-none");
//   })
// }

// const deleteRequest = ()=>{
//
//   const cocktailDeleteModal = document.getElementById('cocktailDeleteModal');
//
//   if (!cocktailDeleteModal) return;
//   const deleteBtn = cocktailDeleteModal.querySelector('#deleteBtn');
//   let cocktailIdToDelete = null;
//   deleteBtn.addEventListener('click', (e) => {
//     e.preventDefault();
//     const last = parseInt(currentPage) === parseInt(totalPages);
//     if (cocktailIdToDelete) {
//
//       deleteCocktail(cocktailIdToDelete)
//           .then(() => {
//             const form = document.querySelector("#filter");
//             const formData = new FormData(form);
//             const filters = Object.fromEntries(formData.entries());
//
//             showToastSuccess("Cocktail supprimé avec succès")
//             listCocktails(currentPage, filters, last ).then(() => {
//               const modalInstance  = bootstrap.Modal.getOrCreateInstance(cocktailDeleteModal)
//               modalInstance.hide();
//             });
//           })
//           .catch((err) => console.error('Erreur lors de la suppression', err));
//     }
//   });
//
//
//   document.body.addEventListener('click', (e) => {
//     const button = e.target.closest('[data-bs-type="delete"]');
//
//     if (button) {
//       const cocktailId = button.getAttribute('data-bs-id');
//       const cocktailName = button.getAttribute('data-bs-name');
//
//       cocktailIdToDelete = cocktailId;
//       const modalName = cocktailDeleteModal.querySelector('#cocktailName');
//       const modalTitle = cocktailDeleteModal.querySelector('#cocktailDeleteModalTitle');
//
//       modalName.textContent = cocktailName;
//       modalTitle.textContent = `Supprimer ${cocktailName}`;
//
//       const modalInstance  = bootstrap.Modal.getOrCreateInstance(cocktailDeleteModal)
//       modalInstance.show();
//     }
//   });
// }
export const getCocktail = async (id)=>{
  const res = await fetch(`/cocktails/${id}`)
  return res.json();
}

export const createCocktail = async (data)=>{

  const res = await fetch(`/cocktails`,{
    method: "post",
    body: data
  })
  return res.json();
}
export const updateCocktail = async (id,data)=>{
  const res = await fetch(`/cocktails/${id}`,{
    method: "put",
    body: data
  })
  return res.json();
}
export const deleteCocktail = async (id)=>{
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


    try {
      fetch('/membres/register', {
        method: 'POST',
        body: new FormData(form),
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
            form.reset();
            showToastSuccess("Votre inscription a été un succès ")
            bootstrap.Modal.getInstance(
                document.querySelector("#inscriptionModal")
            ).hide()
          }
        });
      }).catch((e)=>{
        console.log(e)
      })

    } catch (error) {
      console.error(error);
      erreurs.textContent = 'Une erreur est survenue.';
    }

  })

}
const login = ()=>{
  const form = document.querySelector("#loginForm");
  const erreurs = document.querySelector("#erreursLogin");

  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await fetch('/membres/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const results = await response.json();

      if (!response.ok) {
        displayErrors(erreurs, results.errors)
      } else {
        form.reset();
        const membre = results.membre;
        membre.firstLogin = true
        localStorage.setItem("membreInfos",JSON.stringify(membre))
        if (membre.roles ==="ADMIN") {
          window.location.href = "/admin"
        }else {
          window.location.href = "/"
        }
      }

    } catch (error) {
      console.log(error)
      erreurs.innerHTML = `<p class="alert alert-danger" role="alert">Une erreur est survenue.</p>`;
    }

  })

}

const connectionModal = document.querySelector("#connexionModal");
if(connectionModal){
connectionModal.addEventListener("hidden.bs.modal",()=>{
    document.querySelector("#erreursLogin").innerHTML="";
    document.querySelector("#loginForm").reset()
  })
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
export const showToastSuccess = (message) =>{
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

export const showToastError = (message) =>{
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
  // deleteRequest,
  detailRequest
};
