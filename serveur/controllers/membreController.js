import {
    checkMember,
    checkMemberByMail,
    create,
    getMemberById,
    login,
    update,
    updatePassword
} from "../models/membreModel.js";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import path from "path";
import fs from "node:fs";

export const register = async (req, res) => {

    try {
        const member = req.body;
        const memberExists = await checkMemberByMail(req.body.email)
        if (memberExists) {
            return res.status(400).json({
                ok: false,
                errors: [
                    { msg: "Un membre avec cet email existe déjà !" }
                ]
            })
        }

        member.roles = "USER"
        member.image = req.file ? req.file.filename : null;
        member.password = await bcrypt.hash(member.password, 10);
        const created = await create(member)

        if (!created) {
            return res.status(500).json({
                ok: false,
                errors: [
                    { msg: "Une erreur s'est produite lors de l'enregistrement." }
                ]
            })
        }

        res.status(201).json({
            ok: true,
            message: "Membre créé avec succès"
        })

    }catch(e) {
        console.log(e)
        res.status(500).json({
            ok: false,
            errors: [
                { msg: "Une erreur inconnue s'est produite !" }
            ]
        })
    }
}
export const loginMember = async (req, res) => {
    try {

        const { email, password } = req.body
        const membre = await login(email)

        if (!membre) {
            res.status(403).json({
                ok: false,
                errors: [
                    { msg: "Email ou mot de passe invalide. Veuillez réessayer !" }
                ]
            });
        }

        const match = await bcrypt.compare(password, membre.password)

        if (!match) {
            return res.status(403).json({
                ok: false,
                errors: [{ msg: "Email ou mot de passe invalide. Veuillez réessayer !" }]
            });
        }

        delete membre.password
        res.status(200).json({
            ok: true,
            membre: membre
        })

    }catch(e) {
        console.log(e)
        res.status(500).json({
            ok: false,
            errors: [{ msg: "Une erreur s'est produite pendant cette operation!" }]
        });
    }

}

export const updateMember = async (req, res) => {
    try {
        const memberID = parseInt(req.params.id)
        const memberExists = await getMemberById(memberID)
        const membre = req.body

        if (!memberExists) {
            return res.status(404).json({
                ok: false,
                errors: "Le membre avec l'id " + memberID + " n'existe pas !"
            })
        }

        if (req.file) {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const image_path = path.join(__dirname, "../../", 'client/uploads/images/membre/' + memberExists.photo)
            if (memberExists.photo) {
                if (fs.existsSync(image_path)) {
                    await fs.promises.unlink(image_path);
                }
            }
        }

        membre.image = req.file ? req.file.filename : memberExists.photo;
        membre.id = memberID
        const response = await update(memberID, membre);

        if (response.affectedRows === 0) {
            return res.status(500).json({
                    ok: false,
                    errors: "une erreur s'est produite"
                }
            )
        }

        res.status(200).json({
            ok: true,
            membre: {
                id: memberID,
                nom: membre.lastname,
                prenom: membre.firstname,
                adresse: membre.address,
                sexe: membre.sex,
                photo: membre.image,
                roles: memberExists.roles
            },
            message: "La mise à jour a été un succès !"
        })

    }catch(e) {
        console.log(e)
        res.status(500).json({ ok: false, errors: "une erreur s'est produite" })
    }
}

export const getMember = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const member = await getMemberById(id)
        res.json({ ok: true, result: member })
    }catch(e) {
        console.log(e)
        res.status(500).json({
            ok: false,
            errors: [{ msg: "Une erreur s'est produite !" }]
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const memberID = parseInt(req.params.id);
        const { oldPassword, newPassword } = req.body

        const memberExists = await checkMember(memberID)

        if (!memberExists) {
            return res.status(404).json(
                {
                    ok: false,
                    errors: "Le membre avec l'ID " + memberID + " n'existe pas !"
                }
            )
        }

        const match = await bcrypt.compare(oldPassword, memberExists.password)
        if (!match) {
            return res.status(400).json(
                {
                    ok: false,
                    errors: "Votre ancien mot de passe n'est pas correct !"
                }
            )
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const result = await updatePassword(memberID, hashedNewPassword)

        if (result.affectedRows !== 1) {
            return res.status(400).json(
                {
                    ok: false,
                    errors: "Votre mot de passe n'a pas été mis à jour !"
                }
            )
        }

        res.status(200).json({
                ok: true,
                message: "Votre mot de passe a bien été mis à jour !"
            }
        )

    }catch(e) {
        console.log(e)
        res.status(500).json({
            ok: false,
            errors: "Une erreur s'est produite pendant la mise à jour"
        })
    }
}