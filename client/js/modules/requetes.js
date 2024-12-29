
const COCKTAIL_URL = "http://127.0.0.1:3000/cocktails";
const MEMBER_URL = "http://127.0.0.1:3000/membres";

// const listCocktails = async (page=1, filtres, last= false)=>{
//   const perPage = isAdmin ? ADMIN_PER_PAGE : FRONT_PER_PAGE;
//   const queryParams = new URLSearchParams({ page, ...filtres, perPage, last });
//   const url = `${COCKTAIL_URL}?${queryParams.toString()}`;
//   try {
//     const response = await getCocktails(url);
//     totalPages = response.pagination.totalPages;
//     currentPage = response.pagination.page;
//       isAdmin ? afficherListeCocktailsCardsAdmin(response.result)
//               : afficherListeCocktailsCards(response.result)
//       paginate(response.pagination, filtres)
//   } catch (erreur) {
//     console.log(erreur)
//     console.log("Erreur s'est produite lors de la requête:");
//     return [];
//   }
// }





export const getCocktails = async (url) => {
  const response = await fetch(url);
  return await response.json();
}
export const getCocktailRequest = async (id)=>{
  const res = await fetch(`${COCKTAIL_URL}/${id}`)
  return await res.json();
}
export const createCocktailRequest = async (data)=>{

  const res = await fetch(`${COCKTAIL_URL}`,{
    method: "post",
    body: data
  })
  return await res.json();
}
export const updateCocktailRequest = async (id, data)=>{
  const res = await fetch(`${ COCKTAIL_URL }/${id}`,{
    method: "put",
    body: data
  })
  return await res.json();
}

export const deleteCocktailRequest = async (id)=>{
  const res = await fetch(`${ COCKTAIL_URL }/${id}`,{
    method: "delete",
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return res.json();
}

export const loginRequest = async (data) => {
  const response = await fetch(`${ MEMBER_URL }/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  });
  return await response.json();

}

export const registerRequest = async (data)=>{
  const response = await fetch(`/${ MEMBER_URL }/register`, {
    method: 'POST',
    body: data,
  });
  return await response.json()
}

