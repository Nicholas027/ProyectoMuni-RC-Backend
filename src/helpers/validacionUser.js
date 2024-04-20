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
        .withMessage("El password es obligatorio")
        .isLength({ min: 6 })
        .withMessage("El password debe contener al menos 6 caracteres")
        .matches(/^(?=.*[A-Z])(?=.*\d).{6,}$/)
        .withMessage("El password debe contener al menos una letra en mayúsculas, un número y un mínimo de 6 caracteres"),
    (req, res, next) => { resultadoValidacion(req, res, next) }
]

export default validacionUser