import { Router } from "express";
import {index} from "../controllers/mainController.js";

const router = Router();

router.get("/",index);
export default router;