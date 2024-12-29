import {login, register} from "./memberModals.js";
import {listCocktails} from "./cocktailList.js";
import {filterCocktails} from "./filters.js";
import {handleCocktailDetailsModal, handleCocktailModal, handleDeleteCocktailModal} from "./cocktailModals.js";
import {showToastSuccess} from "./affichage.js";
import { displayCocktailDetails } from "./cocktailDetails.js";

export const initApplication = () => {
    login();
    register();
    handleLogin()
    listCocktails()
    filterCocktails()
    handleImagePreview()
    handleCocktailModal();
    displayCocktailDetails()
    handleDeleteCocktailModal();
    handleCocktailDetailsModal();
}
const handleLogin = () => {
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
        const [nom,prenom,photo] = membre;
        if (membre.firstLogin === true){
            showToastSuccess(`Heureux de vous voir ${prenom} ${nom} !`)
            membre.firstLogin = false;
            localStorage.setItem("membreInfos",JSON.stringify(membre))

        }
        document.querySelector("#loggedOut")?.classList.add("d-none")
        document.querySelector("#loggedIn")?.classList.remove("d-none")
        const memName = document.querySelector("#memberName");
        const memImg = document.querySelector("#memberImg");
        if (memName) memName.textContent = `${prenom} ${nom}`
        if (photo) memImg.src = `/uploads/images/membre/${photo}`
    }
}

const handleImagePreview = () => {
    const photo = document.getElementById('image');
    if(photo) {
        photo.addEventListener('change', function (event) {
            const [files] = event.target
            const file = files[0];
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
}
