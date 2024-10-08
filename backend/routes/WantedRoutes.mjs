import {Router} from "express";
import WantedController from "../controllers/wantedController.mjs";
const router = Router();
// ta dando algum erro aqui dps vou arrumar
router.post("/getone", (req, res) => {
    res.send("rota de busca funcionado")
})

router.get("/getall", WantedController.getAll)
export default router;