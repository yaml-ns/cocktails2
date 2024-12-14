import {login, register} from "../controllers/membreController.js";
import {Router} from "express";
import { validerInscription, validerLogin } from "../middlewares/memberMiddleware.js";

const router = Router();

router.post("/register",validerInscription,register)
router.post("/login",validerLogin,login)

export default router;