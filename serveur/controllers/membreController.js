import {checkMember, create, login} from "../models/membreModel.js";
export const register = async (req,res) => {
    try {
        const member = req.body;
        const memberExists = await checkMember(req.body.email)
        if (!memberExists){
            member.roles ="USER"
            member.image = req.file ? req.file.filename: null;
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
        const [rows] = await login(req.body.email,req.body.password)
        if (rows.length > 0){
            const membre = rows[0];
            res.json({
                ok: true,
                statusCode: 200,
                membre: membre
            })
        }else {
            res.statusCode = 403
            res.json({
                ok: false,
                statusCode:403,
                errors: [
                    { msg:"Login ou mot de passe invalide. Veuillez réessayer !"}
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