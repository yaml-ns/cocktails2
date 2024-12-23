import {loginMember, register} from "../controllers/membreController.js";
import {Router} from "express";
import { validerInscription, validerLogin } from "../middlewares/memberValidation.js";

const router = Router();

router.post("/register",validerInscription,register)
router.post("/login",validerLogin,loginMember)

export default router;