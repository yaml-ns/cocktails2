import {loginMember, register} from "../controllers/membreController.js";
import {Router} from "express";
import { validerInscription, validerLogin } from "../middlewares/memberValidation.js";
import {uploadParams} from "../middlewares/uploadParams.js";
import upload from "../middlewares/singleImageUpload.js";

const router = Router();

router.post("/register",
    uploadParams({type: "membre"}),
    upload.single("image"),
    validerInscription,
    register
)
router.post("/login", validerLogin, loginMember)

export default router;