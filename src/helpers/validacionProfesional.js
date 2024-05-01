import { check } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";

const validacionProfesional = [
    check("nombreCompleto")
        .notEmpty()
        .withMessage("El nombre del profesional es un dato obligatorio")
        .isLength({ min: 8, max: 100 })
        .withMessage("El nombre del profesional debe contener entre 8 y 100 caracteres"),
    check("dni")
        .notEmpty()
        .withMessage("El DNI es un dato obligatorio")
        .isNumeric()
        .withMessage("El DNI debe ser un número")
        .custom((value) => {
            if (value >= 10000000 && value <= 99999999) {
                return true
            } else {
                throw new Error("El DNI es inválido, debe contener 8 dígitos")
            }
        }),
    check("password")
        .notEmpty()
        .withMessage("El password es un dato obligatorio")
        .isLength({ min: 6 })
        .withMessage("El password debe contener al menos 6 caracteres")
        .matches(/^(?=.*[A-Z])(?=.*\d).{6,20}$/)
        .withMessage("El password debe contener al menos una letra en mayúsculas, un número, un mínimo de 6 caracteres y un máximo de 20 caracteres"),
    check("categoria")
        .notEmpty()
        .withMessage("La categoría e sun dato obligatorio")
        .isIn(['Carpintero', 'Gasista', 'Cerrajero', 'Mecanico', 'Electricista', 'Albañil', 'Plomero', 'Pintor', 'Herrero', 'Jardinero', 'Otros'])
        .withMessage("La categoría debe ser una de las siguientes opciones: 'Carpintero','Gasista','Cerrajero','Mecanico', 'Electricista', 'Albañil', 'Plomero', 'Pintor', 'Herrero', 'Jardinero', 'Otros'"),
    check("descripcion")
        .isLength({ min: 20, max: 1000 })
        .withMessage("La descripción debe contener entre 20 y 1000 caracteres"),
    check("calificacion")
        .isIn([1, 2, 3, 4, 5])
        .withMessage("La calificación debe ser un número del 1 al 5"),
    check("telefono")
        .notEmpty()
        .withMessage("El teléfono es un dato obligatorio")
        .isMobilePhone('es-AR')
        .withMessage("El teléfono debe tener el formato usado en Argentina"),
    check("email")
        .notEmpty()
        .withMessage("El email es un dato obligatorio")
        .isEmail()
        .withMessage("Ingrese una dirección email válida"),
    (req, res, next) => { resultadoValidacion(req, res, next) }

]

export default validacionProfesional