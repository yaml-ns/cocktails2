import {login} from "../models/membreModel.js";
export const register = async (req,res) => {
    console.log("in register")
    res.json({message:"register réussi"});
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
                errors: "Login ou mot de passe invalide. Veuillez réessayer !"
            });
        }
    }catch (e) {
        console.log(e)
        res.statusCode = 500;
        res.json({
            ok:false,
            statusCode:403,
            errors:[{msg:"Une erreur s'est produite pendant cette operation!"}]
        });
    }

}