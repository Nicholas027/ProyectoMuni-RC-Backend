import { Router } from "express";
import { professionalRegister, professionalsList } from "../controllers/professional.controllers.js";
import validacionProfesional from "../helpers/validacionProfesional.js"

const router = Router();
router.route("/register").post([validacionProfesional], professionalRegister);
router.route("/professionals").get(professionalsList);

export default router;