import {Router} from "express";
const router = Router();
// ta dando algum erro aqui dps vou arrumar
router.post("/getone", (req, res) => {
    res.send("rota de busca funcionado")
})

router.get("/getall", (req, res) => {
    res.send("rota de getall funcionando")
})
export default router;