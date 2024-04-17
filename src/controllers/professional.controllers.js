import bcrypt from "bcrypt";
import Professional from "../database/models/professional.js";

export const professionalRegister = async (req, res) => {
  try {
    const { dni, password, email } = req.body;

    const professionalEmailSearch = await Professional.findOne({ email });
    if (professionalEmailSearch) {
      return res
        .status(400)
        .json({ message: "Ya existe un profesional con el email enviado" });
    }

    const professionalDniSearch = await Professional.findOne({ dni });
    if (professionalDniSearch) {
      return res.status(400).json({
        message: "Ya existe un profesional con el dni enviado",
      });
    }

    const newProfessional = new Professional(req.body);

    const hashSalts = process.env.HASH_SALTS;
    const salt = bcrypt.genSaltSync(parseInt(hashSalts));
    const hashedPassword = bcrypt.hashSync(password, salt);

    newProfessional.pass = hashedPassword;

    const savedProfessional = await newProfessional.save();

    res.status(201).json({
      profesional: savedProfessional,
      mensaje: "El profesional fue registrado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensage: "Hubo un error al procesar la solicitud",
      error: error.message,
    });
  }
};

export const professionalsList = async (req, res) => {
  try {
    const profesionales = await Professional.find();
    res.status(200).json(profesionales);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      mensaje: "No se pudo obtener la lista de profesionales.",
    });
  }
};

export const professionalAlone = async (req, res) => {
  try {
    const profesionalBuscado = await Professional.findById(req.params.id);
    // Responder con el producto
    res.status(200).json(profesionalBuscado);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      mensaje: "No se encontró el profesional buscado.",
    });
  }
};