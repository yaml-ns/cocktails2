import {
    requeteListerCocktails,
    requeteAvecFiltres,
    register,
    login,
    updateRequest,
    deleteRequest,
    createRequest
} from "./modules/requetes.js";
import { afficherDetailsCocktail } from "./modules/affichage.js";

document.addEventListener("DOMContentLoaded", async () => {

    login();
    register();
    createRequest()
    updateRequest();
    deleteRequest();
    const conteneur = document.querySelector("#mainContent");
    await requeteListerCocktails();

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





$("#filter input, #filter select").on("input",(e)=>{

  if(e.target.id ==="nom" && e.target.value.length >=3){
    requeteAvecFiltres();
  }
  if (e.target.value.length === 0){
     requeteListerCocktails()
  }else{
    requeteAvecFiltres()
  }
})




