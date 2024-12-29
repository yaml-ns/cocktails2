import {afficherDetailsCocktail} from "./affichage.js";

export const displayCocktailDetails = () => {
    const conteneur = document.querySelector("#mainContent");
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
}