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
export const getCocktail = async (id)=>{
  const res = await fetch(`/cocktails/${id}`)
  return await res.json();
}
export const createCocktail = async (data)=>{

  const res = await fetch(`/cocktails`,{
    method: "post",
    body: data
  })
  return await res.json();
}
export const updateCocktail = async (id,data)=>{
  const res = await fetch(`/cocktails/${id}`,{
    method: "put",
    body: data
  })
  return await res.json();
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

export const loginRequest = async (data) => {
  const response = await fetch('/membres/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  });
  return await response.json();

}

export const registerRequest = async (data)=>{
  const response = await fetch('/membres/register', {
    method: 'POST',
    body: data,
  });
  return await response.json()
}









export {
  listCocktails,
  detailRequest
};
