import { Router } from "express";
import {index, admin} from "../controllers/mainController.js";

const router = Router();

router.get("/",index);
router.get("/admin",admin);
export default router;