import { Router } from "express";
import { userRegister, userSignIn, usersList } from "../controllers/user.controllers.js";
import validacionUser from "../helpers/validacionUser.js";

const routerUser = Router();

routerUser.route("/users/register").post([validacionUser], userRegister);
routerUser.route("/users").get(usersList);
routerUser.route("/users/signIn").post(userSignIn);


export default routerUser;