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
    .withMessage("El password es un dato obligatorio")
    .isLength({ min: 6 })
    .withMessage("El password debe contener al menos 6 caracteres")
    .matches(/^(?=.*[A-Z])(?=.*\d).{6,20}$/)
    .withMessage(
      "El password debe contener al menos una letra en mayúsculas, un número, un mínimo de 6 caracteres y un máximo de 20 caracteres"
    ),
  check("nombre")
    .notEmpty()
    .withMessage("El nombre del usuario es un dato obligatorio")
    .isLength({ min: 3, max: 30 })
    .withMessage("El nombre del usuario debe contener entre 3 y 30 caracteres"),
  (req, res, next) => {
    resultadoValidacion(req, res, next);
  },
];

export default validacionUser;
