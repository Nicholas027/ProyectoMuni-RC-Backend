import bcrypt from "bcrypt";
import User from "../database/models/user.js";
import generarJWT from "../helpers/generarJWT.js";

export const userRegister = async (req, res) => {
  try {
    const { password, email } = req.body;

    const userEmailSearch = await User.findOne({ email });
    if (userEmailSearch) {
      return res
        .status(400)
        .json({ message: "Ya existe un usuario con el email enviado" });
    }

    const newUser = new User(req.body);

    const hashSalts = process.env.HASH_SALTS;
    const salt = bcrypt.genSaltSync(parseInt(hashSalts));
    const hashedPassword = bcrypt.hashSync(password, salt);

    newUser.password = hashedPassword;

    const savedUser = await newUser.save();

    res.status(201).json({
      user: savedUser,
      mensaje: "El usuario fue registrado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensage: "Hubo un error al procesar la solicitud",
      error: error.message,
    });
  }
};

export const usersList = async (req, res) => {
  try {
    const usuarios = await User.find();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      mensaje: "No se pudo obtener la lista de usuarios.",
    });
  }
};