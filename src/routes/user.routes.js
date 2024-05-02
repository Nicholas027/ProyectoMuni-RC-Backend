import { Router } from "express";
import { userRegister } from "../controllers/user.controllers.js";
import validacionUser from "../helpers/validacionUser.js";

const router = Router();

router.route("/user/register").post([validacionUser], userRegister);

export default router;