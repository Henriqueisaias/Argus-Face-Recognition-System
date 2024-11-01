import {Router} from "express";
import WantedController from "../controllers/wantedController.mjs";
import multer from "multer";
const router = Router();

const upload = multer();
// ta dando algum erro aqui dps vou arrumar
router.post("/getone", (req, res) => {
    res.send("rota de busca funcionado")
})

router.get("/getall", WantedController.getAll)

router.post("/search", upload.single("image"), WantedController.search);
export default router;