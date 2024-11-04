import {Router} from "express";
import WantedController from "../controllers/wantedController.js";
import multer from "multer";
const router = Router();

const upload = multer();
// ta dando algum erro aqui dps vou arrumar
router.post("/getOne", WantedController.getOne)

router.get("/getAll", WantedController.getAll)

router.post("/search", upload.single("image"), WantedController.search);
export default router;