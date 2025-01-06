import { listCocktails } from "./cocktailList.js";

const currentPage = parseInt(document.querySelector(".page.active")?.innerText) || 1;

export function afficherPage(liste, page, itemsPerPage, afficherListe) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = liste.slice(startIndex, endIndex);
    afficherListe(pageItems); // Appel de la fonction pour afficher les éléments
}

// Fonction pour générer les boutons de pagination
export function genererPagination(liste, itemsPerPage, afficherPage, afficherListe, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Vider le contenu actuel

    const pageCount = Math.ceil(liste.length / itemsPerPage); // Calculer le nombre de pages
    const maxButtons = 5; // Nombre maximum de boutons à afficher en même temps

    // Bouton pour aller à la première page <<
    const firstButton = document.createElement('button');
    firstButton.innerHTML = '<i class="bi bi-chevron-double-left"></i>';
    firstButton.classList.add('btn', 'btn-outline-primary', 'me-2');
    firstButton.addEventListener('click', () => {
        afficherPage(liste, 1, itemsPerPage, afficherListe);
        genererPagination(liste, itemsPerPage, afficherPage, afficherListe, 1); // Met à jour la pagination
    });
    pagination.appendChild(firstButton);

    // Générer les boutons de pages
    let startPage = Math.max(currentPage - Math.floor(maxButtons / 2), 1);
    let endPage = Math.min(startPage + maxButtons - 1, pageCount);

    if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(endPage - maxButtons + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('btn', 'btn-outline-primary', 'me-2');
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            afficherPage(liste, i, itemsPerPage, afficherListe);
            genererPagination(liste, itemsPerPage, afficherPage, afficherListe, i); // Met à jour la pagination
        });
        pagination.appendChild(button);
    }

    // Ajouter des ellipses si nécessaire
    if (endPage < pageCount) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.classList.add('me-2');
        pagination.appendChild(ellipsis);
    }

    // Bouton pour aller à la dernière page >>
    const lastButton = document.createElement('button');
    lastButton.innerHTML = '<i class="bi bi-chevron-double-right"></i>';
    lastButton.classList.add('btn', 'btn-outline-primary', 'me-2');
    lastButton.addEventListener('click', () => {
        afficherPage(liste, pageCount, itemsPerPage, afficherListe);
        genererPagination(liste, itemsPerPage, afficherPage, afficherListe, pageCount); // Met à jour la pagination
    });
    pagination.appendChild(lastButton);
}

export const paginate = (page, filtres) => {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    const maxButtons = 5;

    const prevButton = document.createElement("button");
    prevButton.className = `btn btn-outline-primary me-1 ${parseInt(page.page) === 1 ? "disabled" : ""}`;
    prevButton.innerHTML = `<i class="bi bi-chevron-double-left"></i>`;
    prevButton.addEventListener("click", async (e) => {
        e.preventDefault();
        if (page.hasPreviousPage) {
            await listCocktails(parseInt(page.page) - 1, filtres)
        }
    });
    pagination.appendChild(prevButton);

    let startPage = Math.max(currentPage - Math.floor(maxButtons / 2), 1);
    let endPage = Math.min(startPage + maxButtons - 1, page.totalPages);

    if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(endPage - maxButtons + 1, 1);
    }

    for (let i = startPage; i <= parseInt(page.totalPages); i++) {
        const pageButton = document.createElement("button");
        pageButton.className = `btn btn-outline-primary me-1 page ${i === parseInt(page.page) ? "active disabled" : ""}`;
        pageButton.innerHTML = `${i}`;
        pageButton.addEventListener("click", async (e) => {
            e.preventDefault();
            await listCocktails(i, filtres)
        });
        pagination.appendChild(pageButton);
    }


    if (endPage < page.totalPages) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.classList.add('me-2');
        pagination.appendChild(ellipsis);
    }

    const nextButton = document.createElement("button");
    nextButton.className = `btn btn-outline-primary me-1 ${parseInt(page.page) === parseInt(page.totalPages) ? "disabled" : ""}`;
    nextButton.innerHTML = `<i class="bi bi-chevron-double-right"></i>`;
    nextButton.addEventListener("click", async (e) => {
        e.preventDefault();
        if (page.hasNextPage) {
            await listCocktails(parseInt(page.page) + 1, filtres)
        }
    });
    pagination.appendChild(nextButton);
}