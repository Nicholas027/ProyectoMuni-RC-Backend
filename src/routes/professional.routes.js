import { Router } from "express";
import { professionalRegister, professionalsList, professionalAlone, professionalEdit, professionalDelete, modificarEstadoProfesional, professionalAdminRegister, professionalsListCategory, professionalsCategories, searchProfessionals, login, saveCV, uploadProfilePhoto, agregarComentario, searchProfessionalsIndex } from "../controllers/professional.controllers.js";
import validacionProfesional from "../helpers/validacionProfesional.js"
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();
router.route("/professionals/register").post([validacionProfesional], professionalRegister);
router.route("/professionals").get(professionalsList);
router.route("/professionals/categories").get(professionalsCategories)
router.route("/professionals/:id").get(professionalAlone).put([validacionProfesional], professionalEdit).delete(professionalDelete);
router.route("/professionals/:id/state").put(modificarEstadoProfesional);
router.route("/professionals/registerAdmin").post(professionalAdminRegister);
router.route("/professionals/category/:categoria").get(professionalsListCategory);
router.route("/professionals/category/:categoria/:search").get(searchProfessionals);
router.route("/").post(login);
router.route("/professionals/:id/cv").post(upload.single("cv"), saveCV);
router.route("/professionals/:id/photo").post(upload.single("foto"), uploadProfilePhoto);
router.route("/professionals/:id/comments").post(agregarComentario);
router.route("/professionals/buscador/:search").get(searchProfessionalsIndex);

export default router;