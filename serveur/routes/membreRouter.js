import {changePassword, getMember, loginMember, register, updateMember} from "../controllers/membreController.js";
import {Router} from "express";
import {
    validerInscription,
    validerLogin,
    validerProfil,
    validerResetPassword
} from "../middlewares/memberValidation.js";
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
router.put("/:id",
    uploadParams({type: "membre"}),
    upload.single("image"),
    uploadPath,
    validerProfil,
    updateMember
)
router.put("/reset/:id",
    validerResetPassword,
    changePassword
)
router.post("/login", validerLogin, loginMember)

router.get("/:id", getMember)

export default router;