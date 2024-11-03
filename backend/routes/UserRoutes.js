import {Router} from "express";
import UserController from "../controllers/UserController.js";
const router = Router()


router.post("/register", UserController.register
)

router.get("/getAll", UserController.getAllUsers)

router.delete("/delete", UserController.deleteUser)

export default router;