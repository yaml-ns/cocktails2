
const COCKTAIL_URL = "http://127.0.0.1:3000/cocktails";
const MEMBER_URL = "http://127.0.0.1:3000/membres";

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

