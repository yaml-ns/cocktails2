import {displayErrors, showToastSuccess} from "./affichage.js";
import {loginRequest, registerRequest} from "./requetes.js"
const connectionModal = document.querySelector("#connexionModal");
export const login = ()=>{
    if (!connectionModal) return;
    const form = document.querySelector("#loginForm");
    const erreurs = document.querySelector("#erreursLogin");

    if (!form) return;
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        try {
            const response = await loginRequest(JSON.stringify(data))
            if (!response.ok) {
                displayErrors(erreurs, response.errors)
            } else {
                form.reset();
                const membre = response.membre;
                membre.firstLogin = true
                localStorage.setItem("membreInfos",JSON.stringify(membre))
                if (membre.roles ==="ADMIN") {
                    window.location.href = "/admin"
                }else {
                    window.location.href = "/"
                }
            }
        } catch (error) {
            console.log(error)
            erreurs.innerHTML = `<p class="alert alert-danger" role="alert">Une erreur est survenue.</p>`;
        }

    })

}


if(connectionModal){
    connectionModal.addEventListener("hidden.bs.modal",()=>{
        document.querySelector("#erreursLogin").innerHTML="";
        document.querySelector("#loginForm").reset()
    })
}

export const register = ()=>{
    const form = document.querySelector("#inscriptionForm");
    const erreurs = document.querySelector("#erreursInscription");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const response = await registerRequest(new FormData(form))
        if (response.ok){
            form.reset();
            showToastSuccess("Votre inscription a été un succès ")
            bootstrap.Modal.getInstance(
                document.querySelector("#inscriptionModal")
            ).hide()
        }else{
            displayErrors(erreurs,response.errors)
        }

    })

}