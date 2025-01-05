import connexion from "../../services/connexion.js";

export const login = async (email)=>{
    return connexion.query(`SELECT m.id, m.nom, m.prenom, m.adresse, m.sexe, m.photo, c.email,c.password, c.roles 
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
                            (id_membre,email,password,roles)
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
export const getMemberById = async (id)=>{
    const [rows] = await connexion.query(`SELECT m.id, m.nom, m.prenom, m.adresse, m.sexe, m.photo, c.roles 
                                FROM membres m
                                LEFT JOIN connexion c 
                                ON c.id_membre = m.id
                                WHERE m.id = ?`,
        [id])
    return rows[0];
}

export const update = async (id,data)=>{
    const [rows] = await connexion.query(`UPDATE membres 
                                          SET prenom = ?, nom = ?, adresse = ?, sexe = ?, photo = ? 
                                          WHERE id = ?
                                    `,[ data.firstname,data.lastname,data.address,data.sex,data.image, id ])
    return rows;
}