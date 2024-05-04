import { Router } from "express";
import { userRegister, usersList } from "../controllers/user.controllers.js";
import validacionUser from "../helpers/validacionUser.js";

const routerUser = Router();

routerUser.route("/users/register").post([validacionUser], userRegister);
routerUser.route("/users").ger(usersList);


export default routerUser;