import {loginMember, register} from "../controllers/membreController.js";
import {Router} from "express";
import { validerInscription, validerLogin } from "../middlewares/memberValidation.js";
import {uploadParams} from "../middlewares/uploadParams.js";
import { upload } from "../middlewares/singleImageUpload.js";
import {uploadPath} from "../middlewares/uploadPath.js";

const router = Router();

router.post("/register",
    uploadParams({type: "membre"}),
    upload.single("image"),
    uploadPath,
    validerInscription,
    register
)
router.post("/login", validerLogin, loginMember)

export default router;