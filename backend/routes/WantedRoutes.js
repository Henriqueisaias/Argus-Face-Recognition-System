import {Router} from "express";
import WantedController from "../controllers/wantedController.js";
import multer from "multer";
const router = Router();

const upload = multer();

router.get("/getOne/:cpf", WantedController.getOne)
    
router.get("/getAll", WantedController.getAll)

router.post("/search", upload.single("image"), WantedController.search);

router.post("/register", upload.single("image"), WantedController.register)

router.put("/update/:id", upload.single("image"), WantedController.update )

export default router;