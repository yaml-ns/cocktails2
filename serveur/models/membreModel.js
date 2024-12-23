import connexion from "../../services/connexion.js";

export const login = async (email,password)=>{
    return connexion.query(`SELECT m.id, m.nom, m.prenom, m.adresse, m.sexe, m.photo, c.email, c.roles 
                                FROM connexion c
                                LEFT JOIN membres m 
                                ON c.id_membre = m.id
                                WHERE c.email = ? 
                                AND c.motDePasse = ?`,
                            [email, password]
    );
}