import { check } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";

const validacionUser = [
    check("email")
    .notEmpty()
    .withMessage("El email es un dato obligatorio")
    .isEmail()
    .withMessage("Ingrese una dirección de email válida"),
    check("password")
    .notEmpty()
    .withMessage("El password es obligatorio"),
    (req,res,next) =>{resultadoValidacion(req,res,next)}
]

export default validacionUser

//decidir un formato para el password, ver el length del email