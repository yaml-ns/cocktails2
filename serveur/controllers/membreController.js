import {
    checkMemberByMail,
    create,
    login,
    getMemberById,
    update,
    checkMember,
    updatePassword
} from "../models/membreModel.js";
import bcrypt from "bcrypt";
import {fileURLToPath} from "url";
import path from "path";
import fs from "node:fs";
export const register = async (req,res) => {
    try {
        const member = req.body;
        const memberExists = await checkMemberByMail(req.body.email)
        if (!memberExists){

            member.roles ="USER"
            member.image = req.file ? req.file.filename: null;
            member.password = await bcrypt.hash(member.password, 10);
            const created = await create(member)

            if (created){
                res.statusCode = 201;
                res.json({
                    ok: true,
                    message: "Membre créé avec succès"
                })
            }else{
                res.statusCode = 400;
                res.json({
                    ok: false,
                    errors: [
                        {msg: "Une erreur s'est produite lors de l'enregistrement."}
                    ]
                })
            }
        }else{
            res.statusCode = 400;
            res.json({
                ok: false,
                errors: [
                    { msg: "Un membre avec cet email existe déjà !"}
                ]
            })

        }
    }catch (e){
        console.log(e)
        res.statusCode = 500;
        res.json({
            ok: false,
            errors: [
                { msg:"Une erreur inconnue s'est produite !"}
            ]
        })
    }
}
export const loginMember = async (req, res) => {
    try {
        const [rows] = await login(req.body.email)
        if (rows.length > 0){
            const membre = rows[0];
            const match = await bcrypt.compare(req.body.password,membre.password)
            if (match){
                delete membre.password
                res.json({
                    ok: true,
                    statusCode: 200,
                    membre: membre
                })
            }else{
                res.statusCode = 403
                res.json({
                    ok: false,
                    statusCode:403,
                    errors: [
                        { msg:"Email ou mot de passe invalide. Veuillez réessayer !"}
                    ]
                });
            }
        }else {
            res.statusCode = 403
            res.json({
                ok: false,
                statusCode:403,
                errors: [
                    { msg:"Email ou mot de passe invalide. Veuillez réessayer !"}
                ]
            });
        }
    }catch (e) {
        console.log(e)
        res.statusCode = 500;
        res.json({
            ok:false,
            statusCode:403,
            errors:[
                { msg:"Une erreur s'est produite pendant cette operation!"}
            ]
        });
    }

}

export const updateMember = async (req,res) => {
        try {
            const memberID = parseInt(req.params.id)
            const memberExists = await getMemberById(memberID)
            const membre = req.body
            if (memberExists){
                if (req.file){
                    const __filename = fileURLToPath(import.meta.url);
                    const __dirname = path.dirname(__filename);
                    const image_path = path.join(__dirname,"../../" ,'client/uploads/images/membre/'+memberExists.photo)
                    if (memberExists.photo){
                        if (fs.existsSync(image_path)) {
                            await fs.promises.unlink(image_path);
                        }
                    }
                }
                membre.image = req.file ? req.file.filename: memberExists.photo;
                membre.id = memberID
                const response = await update(memberID,membre);
                if (response.affectedRows === 1){

                    res.statusCode = 200;
                    res.json({
                        ok:true,
                        membre:{
                            id: memberID,
                            nom: membre.lastname,
                            prenom: membre.firstname,
                            adresse: membre.address,
                            sexe : membre.sex,
                            photo: membre.image,
                            roles: memberExists.roles
                        },
                        message:"La mise à jour a été un succès !"})
                }else{
                    res.statusCode = 400
                    res.json({ok:false,errors:"une erreur s'est produite" })
                }
            }else{
                res.statusCode = 404
                res.json({ok:false,errors:"Le membre avec l'id "+memberID+" n'existe pas !" })
            }
        }catch (e) {
            console.log(e)
            res.statusCode = 500
            res.json({ok:false,errors:"une erreur s'est produite" })
        }
}

export const getMember = async (req,res) => {
  try{
      const id = parseInt(req.params.id);
      const member = await getMemberById(id)
      res.json({ok: true, result: member})
  }catch (e){
      console.log(e)
      res.json({ok:false,errors:[{msg:"Une erreur s'est produite !"}]})
  }
}

export const changePassword = async (req,res) => {
    try {
        const memberID = parseInt(req.params.id);
        const {oldPassword, newPassword } = req.body

        const memberExists = await checkMember(memberID)

        if (! memberExists){
            res.statusCode = 404;
            return res.json(
                {
                    ok:false,
                    errors:"Le membre avec l'ID "+memberID + " n'existe pas !"
                }
            )
        }

        const match = await bcrypt.compare(oldPassword,memberExists.password)
        if (!match){
            res.statusCode = 400;
            return res.json(
                {
                    ok:false,
                    errors:"Votre ancien mot de passe n'est pas correct !"
                }
            )
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const result = await updatePassword(memberID, hashedNewPassword)

        if (result.affectedRows !== 1){
            res.statusCode = 400;
            return res.json(
                {
                    ok:false,
                    errors:"Votre mot de passe n'a pas été mis à jour !"
                }
            )
        }
        res.statusCode = 200
        res.json({
            ok:true,
            message:"Votre mot de passe a bien été mis à jour !"
        }
        )

    }catch (e) {
        console.log(e)
        res.status(500).json({
            ok: false,
            errors: "Une erreur s'est produite pendant la mise à jour"
        })
    }
}