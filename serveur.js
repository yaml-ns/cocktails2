import http from "http"
import path from "path";
import dotenv from "dotenv";
import express from "express"
import { fileURLToPath } from "url";
import cocktailRouter from "./serveur/routes/cocktailRouter.js";
import mainRouter from "./serveur/routes/mainRouter.js";
import adminRouter from "./serveur/routes/adminRouter.js";
import memberRouter from "./serveur/routes/membreRouter.js";


const app = express();

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "client")));
app.use(express.json())
app.use("/", mainRouter);
app.use("/admin",adminRouter);
app.use("/membres",memberRouter);
app.use("/cocktails",cocktailRouter);


const serveur = http.createServer(app);

const PORT = process.env.APP_PORT || 3000
const HOST = process.env.APP_HOST || "127.0.0.1"
serveur.listen(PORT,HOST,()=>{
    console.log(`Serveur en route sur http://${HOST}:${PORT}`);
})
