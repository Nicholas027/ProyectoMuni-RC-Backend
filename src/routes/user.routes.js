import { Router } from "express";
import { userRegister } from "../controllers/user.controllers.js";
import validacionUser from "../helpers/validacionUser.js";

const routerUser = Router();

routerUser.route("/users/register").post([validacionUser], userRegister);

export default routerUser;