import { Router } from "express";
import { professionalRegister } from "../controllers/professional.controllers.js";
import validacionProfesional from "../helpers/validacionProfesional.js"

const router = Router();
router.route("/register").post([validacionProfesional], professionalRegister);

export default router;