import {
    createCocktailRequest,
    updateCocktailRequest,
    getCocktailRequest,
    deleteCocktailRequest,
} from "./requetes.js";

import {
    displayErrors,
    showToastError,
    showToastSuccess
} from "./affichage.js"
import {listCocktails} from "./cocktailList.js";

const cocktailModal = document.querySelector("#cocktailModal");
const cocktailDeleteModal = document.getElementById('cocktailDeleteModal');
const erreurs = document.querySelector("#cocktailErrors")
export const handleCocktailModal = () => {
        if (!cocktailModal) return;
        let actionToPerform = null;
        const form = document.querySelector("#cocktailForm");
        handleButtonsEvents();

        cocktailModal.addEventListener("show.bs.modal", (e) => {
            const actionType = e.relatedTarget.dataset.bsType;

            if (!form) return;
            if (actionType === "new") {
                actionToPerform = addCocktail;
                setColorListHeader();
                setIngredientListHeader();
                resetForm();
            }

            if (actionType === "update") {
                const cocktailID = e.relatedTarget.dataset.bsId;
                getCocktailRequest(cocktailID).then((cocktail) => {
                    const modalTitle = cocktailModal.querySelector('#cocktailModalTitle');
                    const processBtn = cocktailModal.querySelector('#processBtn');
                    modalTitle.textContent = `Mettre à jour le cocktail "${cocktail.name}"`;
                    processBtn.textContent = `Mettre à jour`;
                    populateForm(cocktailModal, cocktail);
                    actionToPerform = (data) => update(data, cocktailID);
                }).catch(() => {
                    showToastError("Impossible de récupérer les données. Réessayez SVP!");
                });
            }
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (actionToPerform) actionToPerform(new FormData(form));
        });

        cocktailModal.addEventListener('hidden.bs.modal', () => {
            resetForm();
        });

        const resetForm = () => {
            form.reset();
            cocktailModal.querySelector("#imagePreview").setAttribute("src", "/images/bg/non_disponible.png");
            cocktailModal.querySelector("#cocktailModalTitle").textContent = "Ajouter un Cocktail";
            cocktailModal.querySelector('#processBtn').textContent = "Enregistrer";
            cocktailModal.querySelector("#cocktailErrors").innerHTML = "";
            cocktailModal.querySelector("#ingredientsList").innerHTML = "";
            cocktailModal.querySelector("#cocktailColors").innerHTML = "";
            cocktailModal.querySelector("#colorListHeader").classList.add("d-none");
        }
    }
export const handleDeleteCocktailModal = ()=>{
    if (!cocktailDeleteModal) return;
    cocktailDeleteModal.addEventListener("show.bs.modal",(e)=>{
        const button = e.relatedTarget
        const cocktailId = button.getAttribute('data-bs-id');
        const cocktailName = button.getAttribute('data-bs-name');
        const modalName = cocktailDeleteModal.querySelector('#cocktailName');
        const modalTitle = cocktailDeleteModal.querySelector('#cocktailDeleteModalTitle');
        const deleteButton = cocktailDeleteModal.querySelector("#deleteBtn")

        modalName.textContent = cocktailName;
        modalTitle.textContent = `Supprimer ${cocktailName}`;

        deleteButton.addEventListener("click",()=>{

            const totalPages = document.querySelector(".page").length
            const activePage = document.querySelector(".page.active")
            const currentPage = activePage ? parseInt(activePage.innerText) : 1;
            const last = currentPage === totalPages;

            deleteCocktailRequest(cocktailId).then(()=>{
                const form = document.querySelector("#filter");
                const formData = new FormData(form);
                const filters = Object.fromEntries(formData.entries());

                showToastSuccess("Cocktail supprimé avec succès")
                listCocktails(currentPage, filters, last )
                const modalInstance  = bootstrap.Modal.getOrCreateInstance(cocktailDeleteModal)
                      modalInstance.hide();

          })
            })

    })
}


export const handleCocktailDetailsModal = () => {
    const detailModal = document.getElementById('detailsCocktailModal')
    if (!detailModal) return;
    detailModal.addEventListener("show.bs.modal",(e)=>{
        const target = e.relatedTarget;
        const name = detailModal.querySelector("#detail-name")
        const title = detailModal.querySelector("#cocktailDetailModalTitle")
        const glass = detailModal.querySelector("#detail-glass")
        const price = detailModal.querySelector("#detail-price")
        const colorsList = detailModal.querySelector("#detail-colors")
        const garnish = detailModal.querySelector("#detail-garnish")
        const category = detailModal.querySelector("#detail-category")
        const preparation = detailModal.querySelector("#detail-preparation")
        const ingredientsList = detailModal.querySelector("#detail-ingredients")
        const cocktailImage = detailModal.querySelector("#detail-image")
        const updateButton = detailModal.querySelector("#updateCocktail")
        const deleteButton = detailModal.querySelector("#deleteCocktail")

        getCocktailRequest(target.dataset.cocktailId).then((response)=>{
            title.textContent = response.name
            name.textContent = response.name
            cocktailImage.src = response.image
            glass.textContent = response.glass
            price.textContent = response.price + " $"
            garnish.textContent = response.garnish
            category.textContent = response.category
            preparation.textContent = response.preparation

            let ingredients = "";
            for (let ingredient of response.ingredients){
                if (ingredient.ingredient){
                    const amount = ingredient.amount?`(${ingredient.amount}${ingredient.unit||""})`:"";
                    const label = ingredient.label || ingredient.special ?`  ${ingredient.label || ""} ${ingredient.special || ""}`:"";
                    ingredients += `<li class=""> <span class=""> <i class="bi bi-check2 text-success"></i> <b>${ingredient.ingredient}</b> ${ amount }</span>${label} </li>`
                }
            }
            let colors = "";
            for (let color of response.colors.split(",")){
                colors += `<span class="cocktail-color" style="background-color: ${color}"></span>`
            }

            colorsList.innerHTML = colors
            ingredientsList.innerHTML = ingredients

            updateButton.dataset.bsId = response.id
            deleteButton.dataset.bsId = response.id
            updateButton.dataset.bsName = response.name
            deleteButton.dataset.bsName = response.name
        })

    })
}

const addCocktail = (data)=>{
    createCocktailRequest(data).then((res)=>{
        if (res.ok){
            showToastSuccess("Cocktail créé avec succès")
            listCocktails(1,null,true)
            const modalInstance  = bootstrap.Modal.getOrCreateInstance(cocktailModal)
            modalInstance.hide();
        }else{
            displayErrors(erreurs,res.errors)
        }
    }).catch((e)=>{
        console.error('Erreur lors de la mise a jour ')
        displayErrors(erreurs, e)
    })
}

const update = (data,id)=>{
    const activePage = document.querySelector(".page.active")
    const currentPage = activePage ? parseInt(activePage.innerText) : 1;
    updateCocktailRequest(id, data)
              .then((res) => {
                if (res.ok) {
                    showToastSuccess("Cocktail mis à jour avec succès !")
                    listCocktails(currentPage)
                    const modalInstance = bootstrap.Modal.getOrCreateInstance(cocktailModal)
                    modalInstance.hide();
                } else {
                  displayErrors(erreurs, res.errors)
                }
              })
              .catch((err) => {
                  console.error('Erreur lors de la mise a jour ')
                  displayErrors(erreurs, err)
              });
}

const handleButtonsEvents  = ()=>{
    const ingredientsList = document.querySelector("#ingredientsList");
    const colors = document.querySelector("#cocktailColors");
    document.addEventListener("click",(e)=>{

        const deleteIngButton   =  e.target.closest('[data-bs-type="deleteIng"]');
        const addIngButton      =  e.target.closest('[data-bs-type="addIng"]');
        const deleteColorButton =  e.target.closest('.deleteColor');
        const addColorButton    =  e.target.closest('#addColor');

        if (deleteIngButton){
            deleteIngButton.closest(".ingredient-row").remove();
            setIngredientListHeader()
        }
        if (deleteColorButton){
            deleteColorButton.closest(".color-row").remove();
            setColorListHeader()
        }

        if (addIngButton){
            addIngredient(ingredientsList);
        }
        if (addColorButton){
            addColor(colors);
        }
    })
}

function setIngredientListHeader(){
    const ingredientsListHeader = document.querySelector('#ingredientsListHeader')
    const ingredientRows = document.querySelectorAll(".ingredient-row")
    if (!ingredientRows || ingredientRows.length === 0){

        ingredientsListHeader.innerHTML = `<p id="noIngredient" class="text-center"> 
                                Aucun ingrédient spécifié pour le moment.<br> 
                                Appuyer sur ajouter pour ajouter un ingrédient 
                                </p>
`
    }else{
        ingredientsListHeader.innerHTML = `
        <div class="row">
                    <div class="col-3"><label class="form-label">Nom</label></div>
                    <div class="col-2"><label class="form-label">Quantité</label></div>
                    <div class="col-1"><label class="form-label">Unité</label></div>
                    <div class="col-3"><label class="form-label">Label</label></div>
                    <div class="col-2"><label class="form-label">Spécial</label></div>  
                    </div>
        `;
    }
}

function setColorListHeader(){
    const colorsListHeader = document.querySelector('#colorListHeader')
    const colorRows = document.querySelectorAll(".color-row")
    if (!colorRows || colorRows.length === 0){
        colorsListHeader.classList.remove("d-none")
    }
}

function addIngredient(ingredientsList) {
    const numElements = document.querySelectorAll(".ingredient-row")?.length || 0;
    const elem = document.createElement("div")
    elem.classList.add("row")
    elem.classList.add("ingredient-row")
    elem.innerHTML = `
                    <div class="col-3">
                      <div class="input-group align-items-center">
                          <input type="text" name="ingredients[${numElements}][ingredient]" required class="form-control  form-control-sm">
                                 
                      </div>
                    </div>
                    <div class="col-2">
                        <div class="input-group align-items-center">
                          <input type="text" name="ingredients[${numElements}][amount]"  class="form-control  form-control-sm">
                                 
                      </div>
                    </div>
                    <div class="col-1">
                      <div class="input-group align-items-center">
                          <input type="text" name="ingredients[${numElements}][unit]"  class="form-control  form-control-sm">
                                 
                      </div>
                    </div>
                    <div class="col-3">
                        <div class="input-group align-items-center">
                          <input type="text" name="ingredients[${numElements}][label]"  class="form-control  form-control-sm" >
                                 
                        </div>
                    </div>
                      
                    <div class="col-3">
                      <div class="input-group align-items-center">
                          <input type="text" name="ingredients[${numElements}][special]"  class="form-control  form-control-sm">
                      </div>
                    </div>
                     <span class="deleteIngredient" data-bs-type="deleteIng">x</span>
                    </div>
  `;


    ingredientsList.appendChild(elem)
    setIngredientListHeader()
}

function addColor(colorList) {
    const elem = document.createElement("div")
    document.querySelector("#colorListHeader").classList.add("d-none")
    elem.classList.add("color-row")
    elem.innerHTML = `
                <input type="color" name="colors[]" >
                <span class="deleteColor">x</span>
  `;
    colorList.appendChild(elem)
    setColorListHeader()
}

const populateForm = (modal, cocktail) => {
        const ingredientsList = modal.querySelector("#ingredientsList");
        const colorsList = modal.querySelector("#cocktailColors");
        document.querySelector("#name").value = cocktail.name;
        document.querySelector("#prix").value = cocktail.price;
        document.querySelector("#type").value = cocktail.category || "";
        document.querySelector("#glass").value = cocktail.glass || "";
        document.querySelector("#garnish").value = cocktail.garnish || "";
        document.querySelector("#preparation").value = cocktail.preparation || "";
        document.querySelector("#imagePreview").src = cocktail.image??"/images/bg/no_image.png";

        let ingredientListContent= "";
        cocktail.ingredients.map((ing,index)=>{

              ingredientListContent += `
                    <div class="row ingredient-row">
                    <div class="col-3">
                      <div class="input-group align-items-center">
                          <input type="text" name="ingredients[${index}][ingredient]"  class="form-control  form-control-sm"
                                 value="${ing.ingredient}" required>

                      </div>
                    </div>
                    <div class="col-2">
                        <div class="input-group align-items-center">
                          <input type="text" name="ingredients[${index}][amount]"  class="form-control  form-control-sm"
                                 value="${ing.amount || ''}" >

                      </div>
                    </div>
                    <div class="col-1">
                      <div class="input-group align-items-center">
                          <input type="text" name="ingredients[${index}][unit]"  class="form-control  form-control-sm"
                                 value="${ing.unit || ''}" >

                      </div>
                    </div>
                    <div class="col-3">
                        <div class="input-group align-items-center">
                          <input type="text" name="ingredients[${index}][label]"  class="form-control  form-control-sm"
                                 value="${ing.label || ''}" >

                        </div>
                    </div>

                    <div class="col-3">
                      <div class="input-group align-items-center">
                          <input type="text" name="ingredients[${index}][special]"  class="form-control  form-control-sm"
                                 value="${ing.special || ''}" >

                      </div>
                    </div>
                    <span class="deleteIngredient" data-bs-type="deleteIng">x</span>
                    </div>
          `
          })

        let colorsListContent = "";
        if (cocktail.colors){
          cocktail.colors.split(",").map((color)=>{
            colorsListContent += `
        <div class="color-row">
          <input type="color" name="colors[]"  class="" value="${color}" >
          <span class="deleteColor">x</span>
        </div>
          `
          })
        }
        ingredientsList.innerHTML = ingredientListContent
        colorsList.innerHTML = colorsListContent

        setIngredientListHeader()
        setColorListHeader()
}

document.body.addEventListener('mouseover', (e) => {
    if (e.target.classList.value === "deleteIngredient"){
        const el = e.target.closest(".ingredient-row");
        el.classList.add("border-danger")
    }

});
document.body.addEventListener('mouseout', (e) => {
    if (e.target.classList.value === "deleteIngredient"){
        const el = e.target.closest(".ingredient-row");
        el.classList.remove("border-danger")
    }

});