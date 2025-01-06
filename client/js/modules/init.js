import { login, register, resetPassword } from "./memberModals.js";
import { listCocktails } from "./cocktailList.js";
import { filterCocktails } from "./filters.js";
import { handleCocktailDetailsModal, handleCocktailModal, handleDeleteCocktailModal } from "./cocktailModals.js";
import { handleListNavLink, showToastSuccess } from "./affichage.js";
import { displayCocktailDetails } from "./cocktailDetails.js";

export const initApplication = () => {
    login();
    register();
    handleLogin();
    listCocktails();
    resetPassword();
    filterCocktails();
    handleListNavLink();
    handleCocktailModal();
    displayCocktailDetails();
    handleDeleteCocktailModal();
    handleCocktailDetailsModal();
}

const handleLogout = () => {
    localStorage.removeItem("membreInfos")
    window.location.href = "/"
}
const handleLogin = () => {
    const isAdminPage = document.querySelector("#admin")
    const logout = document.querySelector("#logout")
    const logoutLink = document.querySelector("#logout-link")

    logout.addEventListener("click", handleLogout)
    logoutLink.addEventListener("click", handleLogout)

    const membre = JSON.parse(localStorage.getItem("membreInfos"));
    if (isAdminPage) {
        if (!membre || membre.roles !== "ADMIN") window.location.href = "/"
    }
    if (membre) {
        const { nom, prenom, photo, firstLogin } = membre;
        if (!isAdminPage && membre.roles === "ADMIN") document.querySelector("#admin-link").classList.remove("d-none")
        if (firstLogin === true) {
            showToastSuccess(`Heureux de vous voir ${prenom} ${nom} !`)
            membre.firstLogin = false;
            localStorage.setItem("membreInfos", JSON.stringify(membre))

        }
        document.querySelector("#loggedOut")?.classList.add("d-none")
        document.querySelector("#loggedIn")?.classList.remove("d-none")
        const memName = document.querySelector("#memberName");
        const memImg = document.querySelector("#memberImg");
        if (memName) memName.textContent = `${prenom} ${nom}`
        if (photo) memImg.src = `/uploads/images/membre/${photo}`
    }
}

