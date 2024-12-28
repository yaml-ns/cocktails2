import {
    createCocktail,
    updateCocktail,
    listCocktails,
    getCocktail,
    displayErrors,
    showToastError,
    showToastSuccess, deleteCocktail,
} from "./requetes.js";

const cocktailModal = document.querySelector("#cocktailModal");
const cocktailDeleteModal = document.getElementById('cocktailDeleteModal');
const erreurs = document.querySelector("#cocktailErrors")
export const handleCocktailModal = () => {

    const form = document.querySelector("#cocktailForm")
    if (!cocktailModal) return;
    handleButtonsEvents()
    cocktailModal.addEventListener("show.bs.modal",(e)=>{
        const actionType = e.relatedTarget.dataset.bsType
        let actionToPerform = null;

        if (!form) return;
        if (actionType === "new"){
            actionToPerform = addCocktail
        }
        if (actionType === "update"){
            const cocktailID = e.relatedTarget.dataset.bsId
            getCocktail(cocktailID).then((cocktail)=>{
                const modalTitle = cocktailModal.querySelector('#cocktailModalTitle');
                const processBtn = cocktailModal.querySelector('#processBtn');
                      modalTitle.textContent = `Mettre à jour le cocktail "${cocktail.name}"`;
                      processBtn.textContent = `Mettre à jour`;
                populateForm(cocktailModal,cocktail)
                actionToPerform = (data)=> update(data,cocktailID)
            }).catch(()=>{
                showToastError("Impossible de récupérer les données. Réessayez SVP!")
            })
        }
        form.addEventListener("submit",(e)=>{
            e.preventDefault()
            if (actionToPerform) actionToPerform(new FormData(form));
        })
    })

    cocktailModal.addEventListener('hidden.bs.modal', ()=> {
    form.reset()
    cocktailModal.querySelector("#imagePreview").setAttribute("src","/images/bg/non_disponible.png")
    cocktailModal.querySelector("#cocktailModalTitle").textContent = "Ajouter un Cocktail";
    cocktailModal.querySelector('#processBtn').value = "Enregistrer"
    cocktailModal.querySelector("#cocktailErrors").innerHTML="";
    cocktailModal.querySelector("#ingredientsList").innerHTML="";
    cocktailModal.querySelector("#cocktailColors").innerHTML="";
    cocktailModal.querySelector("#colorListHeader").classList.add("d-none");
  })
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

            deleteCocktail(cocktailId).then(()=>{
                const form = document.querySelector("#filter");
                const formData = new FormData(form);
                const filters = Object.fromEntries(formData.entries());

                showToastSuccess("Cocktail supprimé avec succès")
                listCocktails(currentPage, filters, last ).then(() => {
                      const modalInstance  = bootstrap.Modal.getOrCreateInstance(cocktailDeleteModal)
                      modalInstance.hide();
                });
          })
            })

    })
}
const addCocktail = (data)=>{
    createCocktail(data).then((res)=>{
        if (res.ok){
            showToastSuccess("Cocktail créé avec succès")
            listCocktails(1,null,true).then(() => {
                const modalInstance  = bootstrap.Modal.getOrCreateInstance(cocktailModal)
                modalInstance.hide();
            });
        }else{
            displayErrors(erreurs,res.errors)
        }
    }).catch(()=>{

    })
}
const update = (data,id)=>{
    const activePage = document.querySelector(".page.active")
    const currentPage = activePage ? parseInt(activePage.innerText) : 1;
    updateCocktail(id, data)
              .then((res) => {
                if (res.ok) {
                  showToastSuccess("Cocktail mis à jour avec succès !")
                  listCocktails(currentPage).then(() => {
                    const modalInstance = bootstrap.Modal.getOrCreateInstance(cocktailModal)
                    modalInstance.hide();
                  });
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

