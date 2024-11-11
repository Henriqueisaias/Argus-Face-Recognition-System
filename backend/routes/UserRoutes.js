import {Router} from "express";
import UserController from "../controllers/UserController.js";
const router = Router()


router.post("/register", UserController.register
)

router.post("/login", UserController.login)

router.get("/getAll", UserController.getAllUsers)

router.delete("/delete", UserController.deleteUser)

export default router;