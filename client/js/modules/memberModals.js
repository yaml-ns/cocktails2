import {displayErrors, handleImagePreview, showToastError, showToastSuccess} from "./affichage.js";
import {getMemberRequest, loginRequest, registerRequest, resetPasswordRequest, updateMemberRequest} from "./requetes.js"

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
        const buttonName = form.querySelector("#registerBtn").textContent
        if (buttonName ==="Mettre à jour"){
            const member = JSON.parse(localStorage.getItem("membreInfos"));
            if (member === null){
                bootstrap.Modal.getInstance(
                    document.querySelector("#inscriptionModal")
                ).hide()
                showToastError("Impossible d'effectuer cette opération !")
            }else{
                const response = await updateMemberRequest(member.id, new FormData(form))

                if (response.ok){
                    const membre = response.membre
                    membre.firstLogin = false
                    localStorage.setItem("membreInfos",JSON.stringify(membre))
                    form.reset();
                    const memName = document.querySelector("#memberName");
                    const memImg = document.querySelector("#memberImg");
                    if (memName) memName.textContent = `${membre.prenom} ${membre.nom}`
                    if (membre.photo) memImg.src = `/uploads/images/membre/${membre.photo}`
                    showToastSuccess("Votre profil à été mis à jour avec succès")
                    bootstrap.Modal.getInstance(
                        document.querySelector("#inscriptionModal")
                    ).hide()

                }else{
                    displayErrors(erreurs,response.errors)
                }
            }
        }else{
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
        }

    })

    const registerModal = document.querySelector("#inscriptionModal")
    if (!registerModal) return;

    registerModal.addEventListener("show.bs.modal",(e)=>{
        const imagePreview = registerModal.querySelector("#imagePreview") ||
                                     registerModal.querySelector("#memberImagePreview")
        const image = registerModal.querySelector("#image") ||
                              registerModal.querySelector("#memberImage")

        handleImagePreview(image,imagePreview)

        const button = e.relatedTarget;
        if (button.dataset.type === "update"){
            let loggedMember = localStorage.getItem("membreInfos");
            if (loggedMember != null) {
                loggedMember = JSON.parse(loggedMember);
                const memberID = loggedMember.id;
                registerModal.querySelector("#registerBtn").textContent = "Mettre à jour"
                registerModal.querySelector("#memberModalTitle").textContent = "Mettre à jour le profil"
                const modalBody = registerModal.querySelector(".modal-body");
                const pw = registerModal.querySelector("#password")
                const rpw = registerModal.querySelector("#repeat_password")
                const email = registerModal.querySelector("#email")
                if (pw)    modalBody.removeChild(pw.parentNode)
                if (rpw)   modalBody.removeChild(rpw.parentNode)
                if (email) modalBody.removeChild(email.parentNode)

                getMemberRequest(memberID).then((response)=>{
                    if (response.ok){
                        const member = response.result

                        document.querySelector("#firstname").value = member.prenom;
                        document.querySelector("#lastname").value = member.nom;
                        document.querySelector("#address").value = member.adresse;
                        document.querySelector("#sex").value = member.sexe;
                        imagePreview.src = member.photo ?
                            "/uploads/images/membre/"+member.photo:
                            "/images/bg/no_image.png";
                    }
                })
            }else{
                showToastError("Impossible d'effectuer cette opération !")
                bootstrap.Modal.getInstance(
                    document.querySelector("#inscriptionModal")
                ).hide()
            }

        }
    })
    registerModal.addEventListener("hidden.bs.modal",()=>{
        form.reset();
        document.querySelector("#imagePreview").src = "/images/bg/no_image.png"
    })
}

export const resetPassword = ()=>{
    const form = document.querySelector("#resetPasswordForm");
    const erreurs = document.querySelector("#erreursResetPassword");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const member = JSON.parse(localStorage.getItem("membreInfos"));

        if (member === null){
            bootstrap.Modal.getInstance(
                document.querySelector("#inscriptionModal")
            ).hide()
            showToastError("Impossible d'effectuer cette opération !")
        }else {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            resetPasswordRequest(member.id, JSON.stringify(data))
                .then((response)=>{
                    if (response.ok) {
                        form.reset();
                        showToastSuccess("Votre mot de passe a été changé avec succès")
                        bootstrap.Modal.getInstance(
                            document.querySelector("#resetPasswordModal")
                        ).hide()

                    } else {
                        displayErrors(erreurs, response.errors)
                    }
                    })
                .catch((e)=>{
                    displayErrors(erreurs, "Une erreur s'est produite durant l'opération")
            })

        }
    })


}