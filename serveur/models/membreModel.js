import connexion from "../../services/connexion.js";

export const login = async (email)=>{
    return connexion.query(`SELECT m.id, m.nom, m.prenom, m.adresse, m.sexe, m.photo, c.email,c.motDePasse, c.roles 
                                FROM connexion c
                                LEFT JOIN membres m 
                                ON c.id_membre = m.id
                                WHERE c.email = ?`,
                            [email]
    );
}

export const create = async (membre)=>{
    const db = await connexion.getConnection();
    try {
        await db.beginTransaction();
        const [rows] = await db.query(`
            INSERT INTO membres (nom, prenom, adresse, sexe, photo) 
            VALUES(?,?,?,?,?)
            `,[
                membre.lastname,
                membre.firstname,
                membre.address,
                membre.sex,
                membre.image
            ])
        const id = rows.insertId;
            const [con] = await db.query(`
                            INSERT INTO connexion 
                            (id_membre,email,motDePasse,roles)
                            VALUES(?,?,?,?)`,
                            [id, membre.email, membre.password, membre.roles]
            );
        await db.commit();
        db.release()
        return true;
    }catch (err){
        console.log(err)
        await db.rollback();
        db.release()
        return false
    }
}
export const checkMember = async (email)=>{
    const [rows] = await connexion.query(`SELECT email FROM connexion WHERE email = ?
                                    `,[email])
    return rows.length > 0;
}