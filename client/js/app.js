import {
    listCocktails,
    register,
    login,
    // handleCreateUpdateRequests,
    // deleteRequest,
    detailRequest,
    showToastSuccess
} from "./modules/requetes.js";
import { afficherDetailsCocktail } from "./modules/affichage.js";
import { handleCocktailModal, handleDeleteCocktailModal } from "./modules/modals.js";
document.addEventListener("DOMContentLoaded", async () => {

    const isAdmin = document.querySelector("#admin")
    const logout = document.querySelector("#logout")
    logout.addEventListener("click",()=>{
        localStorage.removeItem("membreInfos")
        window.location.href = "/"
    })
    const membre = JSON.parse(localStorage.getItem("membreInfos"));
    if (isAdmin){
        if (!membre || membre.roles !== "ADMIN") window.location.href ="/"
    }
    if (membre){
        if (membre.firstLogin === true){
            showToastSuccess(`Heureux de vous voir ${membre.prenom} ${membre.nom} !`)
            membre.firstLogin = false;
            localStorage.setItem("membreInfos",JSON.stringify(membre))

        }
        document.querySelector("#loggedOut")?.classList.add("d-none")
        document.querySelector("#loggedIn")?.classList.remove("d-none")
            const memName = document.querySelector("#memberName");
            const memImg = document.querySelector("#memberImg");
            if (memName) memName.textContent = `${membre.prenom} ${membre.nom}`
            if (membre.photo) memImg.src = `/uploads/images/membre/${membre.photo}`
    }

    login();
    register();
    handleCocktailModal();
    handleDeleteCocktailModal()
    // handleCreateUpdateRequests();
    // deleteRequest();
    detailRequest();
    const conteneur = document.querySelector("#mainContent");
    await listCocktails();

    conteneur.addEventListener("click", async (e) => {
    const card = e.target.closest(".card");
    if (!card) return;

    try {
      const response = await fetch(`/cocktails/${card.dataset.ref}`);
      if (response.ok) {
        const data = await response.json();
        conteneur.innerHTML = afficherDetailsCocktail(data);
      } else {
        console.error("Erreur lors de la récupération des données");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  });



});

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
    const photo = document.getElementById('image');
    if(photo) {
        photo.addEventListener('change', function (event) {
            const file = event.target.files[0];
            const imgPreview = document.getElementById('imagePreview');
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imgPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }else{
                imgPreview.src = "/images/bg/non_disponible.png";
            }
        });
    }





