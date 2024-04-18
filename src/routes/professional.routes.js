import { Router } from "express";
import { professionalRegister, professionalsList, professionalAlone, professionalEdit, professionalDelete, professionalsListCategory } from "../controllers/professional.controllers.js";
import validacionProfesional from "../helpers/validacionProfesional.js"

const router = Router();
router.route("/register").post([validacionProfesional], professionalRegister);
router.route("/professionals").get(professionalsList);
router.route("/professionals/:id").get(professionalAlone).put([validacionProfesional], professionalEdit).delete(professionalDelete);
router.route("/professionals/category/:categoria").get(professionalsListCategory);

export default router;