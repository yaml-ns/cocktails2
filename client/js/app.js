import {
    listCocktails,
    register,
    login,
    handleCreateUpdateRequests,
    deleteRequest
} from "./modules/requetes.js";
import { afficherDetailsCocktail } from "./modules/affichage.js";

document.addEventListener("DOMContentLoaded", async () => {

    login();
    register();
    handleCreateUpdateRequests();
    deleteRequest();
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
                imgPreview.src = "/images/bg/no_image.jpg";
            }
        });
    }





