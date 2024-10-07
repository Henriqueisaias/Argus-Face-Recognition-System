import {Router} from "express";
import UserController from "../controllers/UserController.mjs";
const router = Router()


router.post("/register", UserController.register
)

export default router;