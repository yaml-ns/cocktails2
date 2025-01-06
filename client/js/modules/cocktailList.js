import { afficherListeCocktailsCards, afficherListeCocktailsCardsAdmin, showToastError } from "./affichage.js";
import { getCocktails } from "./requetes.js";
import { paginate } from "./pagination.js";

const COCKTAIL_URL = "http://127.0.0.1:3000/cocktails";
const ADMIN_PER_PAGE = 4;
const FRONT_PER_PAGE = 10;
const isAdmin = document.querySelector("#admin")

let totalPages = null;
let currentPage = null;
export const listCocktails = (page = 1, filtres, last = false) => {
    const perPage = isAdmin ? ADMIN_PER_PAGE : FRONT_PER_PAGE;
    const queryParams = new URLSearchParams({ page, ...filtres, perPage, last });
    const url = `${COCKTAIL_URL}?${queryParams.toString()}`;
    try {
        getCocktails(url).then((response) => {
            totalPages = response.pagination.totalPages;
            currentPage = response.pagination.page;
            isAdmin ? afficherListeCocktailsCardsAdmin(response.result)
                : afficherListeCocktailsCards(response.result)
            paginate(response.pagination, filtres)
        }).catch(() => {
            showToastError("Une erreur inconnue s'est produite pendant la récupération des données")
        })

    }catch(_) {
        showToastError("Une erreur inconnue s'est produite pendant la récupération des données")
    }
}